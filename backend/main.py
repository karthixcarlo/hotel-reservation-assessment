import math
from typing import List, Dict, Optional, Tuple
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import random

app = FastAPI(title="Hotel Reservation System")

# Enable CORS for Frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify the frontend origin
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Constants ---
NUM_FLOORS = 10
ROOMS_PER_FLOOR_STD = 10
ROOMS_ON_TOP_FLOOR = 7
LIFT_INDEX = -1
MAX_BOOKING = 5

class Room(BaseModel):
    floor: int
    number: str
    index: int  # 0-indexed position on the floor
    is_occupied: bool = False

    def __hash__(self):
        return hash(self.number)

class BookingRequest(BaseModel):
    size: int

class ResetRequest(BaseModel):
    pass

class BookingResponse(BaseModel):
    booked_rooms: List[Room]
    travel_time: int

class HotelState(BaseModel):
    rooms: List[Room]

# --- Core Logic ---

class Hotel:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(Hotel, cls).__new__(cls)
            cls._instance.init_hotel()
        return cls._instance

    def init_hotel(self):
        self.rooms: List[Room] = []
        # Create rooms
        # Floors 1-9: 10 rooms each (101-110, ... 901-910)
        # Floor 10: 7 rooms (1001-1007)
        
        for f in range(1, 11):
            count = ROOMS_ON_TOP_FLOOR if f == 10 else ROOMS_PER_FLOOR_STD
            for i in range(count):
                room_num = f"{f}{i+1:02d}"
                self.rooms.append(Room(floor=f, number=room_num, index=i))
        
        self.total_rooms = len(self.rooms)

    def reset(self):
        for r in self.rooms:
            r.is_occupied = False

    def randomize(self):
        # Randomly occupy ~40% of rooms for testing
        self.reset()
        for r in self.rooms:
            if random.random() < 0.4:
                r.is_occupied = True

    def calculate_travel_time(self, r1: Room, r2: Room) -> int:
        """
        Cost function:
        Horizontal: 1 min per index diff
        Vertical: 2 min per floor diff
        
        If same floor: simple horizontal distance.
        If different floor: travel to lift (index -1), change floor, travel from lift.
        
        Prompt says: "Stairs/Lifts: Located on the Left (Index -1)."
        And "Vertical travel (2 mins)... prefer stacking".
        """
        if r1.floor == r2.floor:
            return abs(r1.index - r2.index)
        else:
            # Distance from r1 to lift + Distance from r2 to lift + Vertical Lift time
            # r.index - (-1) = r.index + 1
            dist_r1_lift = r1.index + 1
            dist_r2_lift = r2.index + 1
            vertical_time = abs(r1.floor - r2.floor) * 2
            
            return dist_r1_lift + dist_r2_lift + vertical_time

    def calculate_set_cost(self, room_set: List[Room]) -> int:
        """
        Heuristic: Sum of pairwise distances.
        This represents the "tightness" of the cluster.
        """
        if not room_set:
            return 0
        if len(room_set) == 1:
            return 0
            
        total_dist = 0
        for i in range(len(room_set)):
            for j in range(i + 1, len(room_set)):
                total_dist += self.calculate_travel_time(room_set[i], room_set[j])
        return total_dist

    def find_rooms(self, k: int) -> Tuple[List[Room], int]:
        available = [r for r in self.rooms if not r.is_occupied]
        if len(available) < k:
            raise HTTPException(status_code=400, detail="Not enough rooms available")

        # --- Priority A: Same Floor ---
        # Group by floor
        floors = {}
        for r in available:
            if r.floor not in floors:
                floors[r.floor] = []
            floors[r.floor].append(r)

        best_same_floor_set = None
        # We need to sort by floor (1 -> 10) to respect "Secondary Tie-breaker: Choose the lower floor"
        # Since we iterate 1 to 10, the first one we find with Minimal Span is the winner?
        # No, we must find the ONE with smallest span across ALL floors. Use lower floor as tie breaker.
        
        min_span = float('inf')
        
        # Check in floor order
        for f in sorted(floors.keys()):
            floor_rooms = sorted(floors[f], key=lambda x: x.index)
            if len(floor_rooms) >= k:
                # Sliding window to find k rooms with min span
                for i in range(len(floor_rooms) - k + 1):
                    window = floor_rooms[i : i+k]
                    span = window[-1].index - window[0].index
                    
                    if span < min_span:
                        min_span = span
                        best_same_floor_set = window
                    # If span == min_span, we already have the lower floor (since we iterate f from 1..10)
                    # so we keep the existing one.
        
        if best_same_floor_set:
            return best_same_floor_set, self.calculate_set_cost(best_same_floor_set)

        # --- Priority B: Cross-Floor ---
        # "Search for a cluster of K rooms across floors"
        # Heuristic: Pivot-based Nearest Neighbors.
        
        best_cross_set = None
        min_cross_cost = float('inf')
        
        # Optimization: If len(available) is huge, this is O(N^2 log N). N=97 is fine.
        
        for pivot in available:
            # calculate distance from pivot to all others
            # using tuple (dist, room) for sorting
            # We use the calculate_travel_time as the metric for "nearest"
            
            distances = []
            for other in available:
                if pivot == other:
                    continue
                dist = self.calculate_travel_time(pivot, other)
                distances.append((dist, other))
            
            # Sort by distance
            distances.sort(key=lambda x: x[0])
            
            # Take top k-1
            if len(distances) >= k - 1:
                candidate = [pivot] + [d[1] for d in distances[:k-1]]
                
                # Calculate cost of this candidate set (Sum of Pairwise)
                cost = self.calculate_set_cost(candidate)
                
                if cost < min_cross_cost:
                    min_cross_cost = cost
                    best_cross_set = candidate
        
        if best_cross_set:
            return best_cross_set, min_cross_cost
            
        # Should not happen if available >= k
        raise HTTPException(status_code=400, detail="Unable to find suitable room set")

    def park_rooms(self, rooms: List[Room]):
        ids = {r.number for r in rooms}
        for r in self.rooms:
            if r.number in ids:
                r.is_occupied = True

hotel = Hotel()

# --- Routes ---

@app.get("/state")
def get_state():
    return {"rooms": hotel.rooms}

@app.post("/book", response_model=BookingResponse)
def book_room(req: BookingRequest):
    if req.size < 1 or req.size > MAX_BOOKING:
        raise HTTPException(status_code=400, detail=f"Can only book 1 to {MAX_BOOKING} rooms.")
        
    selected_rooms, cost = hotel.find_rooms(req.size)
    hotel.park_rooms(selected_rooms)
    
    return BookingResponse(booked_rooms=selected_rooms, travel_time=cost)

@app.post("/reset")
def reset_hotel():
    hotel.reset()
    return {"message": "Reset successful"}

@app.post("/randomize")
def randomize_hotel():
    hotel.randomize()
    return {"message": "Randomized"}

@app.post("/scenario/recruiter_1")
def scenario_recruiter_1():
    """
    Scenario 1 (Optimization):
    F1: 101, 102, 105, 106 Available.
    F2: 201, 202, 203, 210 Available.
    F3: 301, 302 Available.
    Target: Book 4 rooms -> Should pick F1 (101, 102, 105, 106).
    """
    hotel.reset()
    # Occupy all initially
    for r in hotel.rooms:
        r.is_occupied = True
        
    # Free up specific checks
    free_rooms = [
        # Floor 1
        "101", "102", "105", "106",
        # Floor 2
        "201", "202", "203", "210",
        # Floor 3
        "301", "302"
    ]
    
    for r in hotel.rooms:
        if r.number in free_rooms:
            r.is_occupied = False
            
    return {"message": "Scenario 1 Loaded: F1 has 101,102,105,106 free."}

@app.post("/scenario/recruiter_2")
def scenario_recruiter_2():
    """
    Scenario 2 (Fragmented / Constraint):
    F1: Only 101, 102 Available.
    F2: 201, 202, 203, 204 Available (for booking 4).
    Target: Book 4 rooms -> Skip F1, Book F2.
    """
    hotel.reset()
    # Occupy all F1 except 101, 102
    for r in hotel.rooms:
        if r.floor == 1 and r.number not in ["101", "102"]:
            r.is_occupied = True
    
    return {"message": "Scenario 2 Loaded: F1 has only 101, 102 free."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

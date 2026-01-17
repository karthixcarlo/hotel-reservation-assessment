import unittest
from main import Hotel, Room

class TestHotelAlgorithm(unittest.TestCase):
    def setUp(self):
        self.hotel = Hotel()
        self.hotel.reset()

    def test_priority_a_skip_fragmented_floor(self):
        """
        Edge Case:
        If Floor 1 has rooms 101, 102 available (rest occupied),
        and I want 4 rooms, it should SKIP Floor 1 and book 4 contiguous rooms on Floor 2.
        """
        # Occupy Floor 1 except 101, 102
        # F1 has indices 0 to 9.
        # 101 is index 0, 102 is index 1.
        # Occupy 103 (index 2) through 110 (index 9)
        # Actually prompt says: "If Floor 1 has rooms 101, 102 available". 
        # So we need to occupy 3..10 on floor 1.
        
        # Occupy all rooms first to be clean or just specific ones
        # Use park_rooms
        
        rooms_to_occupy = []
        # Occupy F1, indices 2 to 9
        for i in range(2, 10):
            # 101 is index 0. 10{i+1}
            # i=2 -> 103
            rooms_to_occupy.append(f"1{i+1:02d}")
        
        # Also let's clean Floor 2 so it is fully available
        
        # Set up state
        for r in self.hotel.rooms:
            if r.floor == 1 and r.number in rooms_to_occupy:
                r.is_occupied = True
            else:
                r.is_occupied = False
                
        # Now request 4 rooms
        req_size = 4
        selected, cost = self.hotel.find_rooms(req_size)
        
        print(f"\n[Test Priority A] Selected: {[r.number for r in selected]}")
        
        # Verify:
        # None should be on Floor 1 (since F1 only has 2 available)
        # Should be on Floor 2 (indices 0-3 ideally, numbers 201-204)
        
        floors = {r.floor for r in selected}
        self.assertNotIn(1, floors, "Should skip Floor 1 as it only has 2 rooms")
        self.assertIn(2, floors, "Should pick Floor 2")
        self.assertEqual(len(selected), 4)
        
    def test_priority_b_cross_floor_stacking(self):
        """
        Cross Floor Optimization:
        Prefer stacking rooms on top of each other.
        Scenario:
        F1: Only 101 available.
        F2: Only 201 available.
        F1: 105 also available? No, let's make it simple.
        Request 2 rooms. 
        Should pick 101 and 201 (Cost: Vertical 2 + Dist to lift? No, cost logic).
        Wait, logic:
        r1=101 (index 0), r2=201 (index 0).
        Travel: 
        Horizontal: r1->Lift (-1) = 1. r2->Lift (-1) = 1. Total H = 2.
        Vertical: 2 mins * 1 floor = 2.
        Total = 4.
        
        Compare to:
        F1: 101 available.
        F1: 105 available.
        F2: Full.
        Cost: 101 (idx 0) to 105 (idx 4). H = 4. Total = 4.
        Tie?
        
        Let's force a scenario where stacking is better.
        F1: 101 available.
        F1: 110 available (index 9). Dist = 9.
        F2: 201 available (index 0).
        Request 2 rooms.
        Option 1: 101 + 110. Cost = 9.
        Option 2: 101 + 201. Cost = 1 + 1 + 2 = 4.
        Algorithm should pick 101 + 201.
        """
        # Occupy everything
        for r in self.hotel.rooms:
            r.is_occupied = True
            
        # Free up specific rooms
        # We want to force Priority B (Cross Floor).
        # So no single floor should have 2 rooms.
        # F1: 101 available. 
        # F2: 201 available.
        # F3: 310 available (far away).
        # If we pick 101+201, cost is low (stacking).
        # If we pick 101+310, cost is high.
        
        targets = ["101", "201", "310"]
        for r in self.hotel.rooms:
            if r.number in targets:
                r.is_occupied = False
                
        # Request 2 rooms. Priority A fails (max 1 per floor).
        # Priority B searches for cluster.
        selected, cost = self.hotel.find_rooms(2)
        
        print(f"\n[Test Priority B] Selected: {[r.number for r in selected]}, Cost: {cost}")
        
        numbers = sorted([r.number for r in selected])
        self.assertEqual(numbers, ["101", "201"], "Should prefer vertical stacking (101, 201) over dist (101, 310) or (201, 310)")

if __name__ == "__main__":
    unittest.main()

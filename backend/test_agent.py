import unittest
import os
from agent import get_semantic_query, answer_business_question

class TestLangChainAgent(unittest.TestCase):

    def test_empty_input(self):
        """Test handling of empty user input."""
        result = get_semantic_query("")
        self.assertIn("error", result)
        self.assertEqual(result["error"], "User question cannot be empty.")

    def test_whitespace_input(self):
        """Test handling of whitespace-only input."""
        result = get_semantic_query("   ")
        self.assertIn("error", result)

    def test_valid_query_structure(self):
        """Test if a valid question returns expected JSON structure."""
        if not os.getenv("GROQ_API_KEY"):
            self.skipTest("GROQ_API_KEY not set in environment.")
        
        result = get_semantic_query("Show total revenue by category")
        self.assertNotIn("error", result)
        self.assertIn("measures", result)
        self.assertIn("dimensions", result)
        self.assertIn("filters", result)
        self.assertIsInstance(result["measures"], list)
        self.assertIsInstance(result["dimensions"], list)

    def test_answer_business_question_mock_mode(self):
        """Test full workflow in mock mode."""
        if not os.getenv("GROQ_API_KEY"):
            self.skipTest("GROQ_API_KEY not set in environment.")
            
        result = answer_business_question("Show total revenue")
        self.assertIn("status", result)
        self.assertEqual(result["status"], "success")
        self.assertIn("generated_query", result)

if __name__ == "__main__":
    unittest.main()
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

# Import the fully working LangChain agent you just built!
from agent import agent_chain

# 1. Initialize the FastAPI application
app = FastAPI(title="MetricMind AI API")

# 2. Configure CORS (Cross-Origin Resource Sharing)
# This security setting allows your teammate's Next.js frontend (usually on port 3000)
# to communicate with this backend (on port 8000) without being blocked by the browser.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development, allow any frontend to connect
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 3. Define the data structure
# This tells FastAPI to expect a JSON object containing a "question" string from the frontend
class ChatRequest(BaseModel):
    question: str

# 4. Create the main API route
@app.post("/api/chat")
async def chat_with_agent(request: ChatRequest):
    try:
        # Pass the frontend's question into your Groq Llama 3 model
        response = agent_chain.invoke({"input": request.question})
        
        # Package the AI's response into JSON and send it back to the frontend
        return {"answer": response.content}
        
    except Exception as e:
        # If anything breaks, return a clean 500 error instead of crashing the server
        raise HTTPException(status_code=500, detail=str(e))

# 5. Run the server
if __name__ == "__main__":
    import uvicorn
    print("🚀 Starting MetricMind Backend Server on http://localhost:8000")
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
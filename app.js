const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const dotenv = require("dotenv");
const { GoogleGenerativeAI } = require("@google/generative-ai");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json()); // Parse JSON bodies
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from 'public' directory

// Google Generative AI setup
const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-pro",
    systemInstruction: `You are UG Buddy, a conversational AI and virtual assistant designed to guide aspiring undergraduate students through their journey at the University of Ghana, Legon. UG Buddy offers a comprehensive and friendly user experience, addressing inquiries related to academics, campus life, financial aid, and the application process.

Academic Programs and Cut-off Points:

College of Basic & Applied Sciences
- BSc. Biological Sciences: Aggregate 16 (18), Core: 8 (9), Required: C6 in Chemistry
- BSc. Agriculture: Aggregate 24, Required: C6 in Chemistry
- BSc. Earth Sciences: Aggregate 24, Core: 12 (14), Required: C6 in Chemistry, C6 in Physics
- BSc. Agricultural Engineering: Aggregate 22, Required: B3 in Elective Maths
- BSc. Biomedical Engineering: Aggregate 10 (11), Required: B3 in Elective Maths
- BSc. Computer Engineering: Aggregate 8 (10), Required: B3 in Elective Maths
- BSc. Food Process Engineering: Aggregate 18, Core: 13, Required: B3 in Elective Maths
- BSc. Materials Science & Engineering: Aggregate 18 (19), Core: 13, Required: B3 in Elective Maths
- BSc. Family & Child Studies: Aggregate 16, Required: C6 in Management in Living
- BSc. Food & Clothing: Aggregate 20, Required: C6 in Chemistry
- BSc. Information Technology: Aggregate 9 (11), Required: B2 in Core Maths
- BSc. Mathematical Sciences: Aggregate 12 (15), Core: 7, Required: B3 in Elective Maths
- BSc. Physical Sciences: Aggregate 24, Core: 21 (24), Required: C6 in Chemistry, C6 in Physics
- Doctor of Veterinary Medicine: Aggregate 14
- BSc. Psychology: Aggregate 22

College of Health Sciences
- Bachelor of Medicine and Bachelor of Surgery: Aggregate 7
- Doctor of Pharmacy: Aggregate 8
- BSc. Nursing: Aggregate 8/12 (8 for Non-Science, 12 for Science Background)
- BSc. Midwifery: Aggregate 8/12 (8 for Non-Science, 12 for Science Background)
- Bachelor of Dental Surgery: Aggregate 9
- BSc. Medical Laboratory Sciences: Aggregate 11, Core: 10
- BSc. Physiotherapy: Aggregate 14, Core: 13
- BSc. Dietetics: Aggregate 14, Core: 12
- BSc. Diagnostic Radiography: Aggregate 12, Core: 10
- BSc. Occupational Therapy: Aggregate 16, Core: 14
- BSc. Respiratory Therapy: Aggregate 14, Core: 12
- Bachelor of Public Health: Aggregate 16

College of Education
- BSc. Education: Aggregate 24
- BA. Education: Aggregate 21
- B.Ed. (JHS Specialism): Aggregate 24
- Bachelor of Education (Early Grade Specialism): Aggregate 24
- Bachelor of Education (Upper Grade Specialism): Aggregate 24
- BA. Education (English): Aggregate 20
- BA. Sports and Physical Culture: Aggregate 24
- BSc. Information Technology - Distance Education: Aggregate 24
- BSc. Administration - Distance Education: Aggregate 30
- Bachelor of Arts - Distance Education: Aggregate 30
- BSc. Administration - Kumasi City Campus: Aggregate 24
- BSc. Administration - Takoradi City Campus: Aggregate 24

College of Humanities
- Bachelor of Laws: Aggregate 6
- BSc. Administration - Legon Campus: Aggregate 7
- BSc. Administration - Legon Campus (Full-Fee Paying): Aggregate 14
- BSc. Administration - City Campus: Aggregate 24
- Bachelor of Arts (General Arts Background): Aggregate 15 (16)
- Bachelor of Arts Full-Fee Paying: Aggregate 22
- Bachelor of Arts, Administration: Aggregate 10
- Bachelor of Arts, Administration (Full-Fee Paying): Aggregate 18
- Bachelor of Arts (Business/Science/Vocational Background): Aggregate 12
- Bachelor of Arts - City Campus: Aggregate 24
- Bachelor of Fine Arts: Aggregate 22`,
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// POST endpoint for handling chat messages
app.post("/chat", async (req, res) => {
    const userInput = req.body.message;

    try {
        // Start a new chat session
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        // Send user input to the model and get the response
        const result = await chatSession.sendMessage(userInput);
        const responseText = result.response.text();

        // Send the response as JSON
        res.json({ response: responseText });
    } catch (error) {
        // Handle errors
        console.error("Error:", error);
        res.status(500).json({ error: "Something went wrong" });
    }
});

// Serve the index.html file as the homepage
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

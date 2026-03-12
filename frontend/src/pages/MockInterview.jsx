import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Navbar from "../components/Navbar";

export default function MockInterview() {
  const [role, setRole] = useState("");
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMSG, setErrorMSG] = useState("");

  const startInterview = async () => {
    if (!role) {
      toast.error("Please select a role first!");
      return;
    }
    setLoading(true);
    setErrorMSG("");
    setQuestions([]);
    setAnswers({});
    try {
      const response = await axios.post(
        "http://localhost:8000/api/interview/generate/",
        { role },
        { withCredentials: true }
      );
      setQuestions(response.data.questions || []);
      toast.success("Questions generated successfully!");
    } catch (error) {
      console.error(error);
      const errMsg = error.response?.data?.error || "Failed to generate questions.";
      setErrorMSG(errMsg);
      toast.error("Error generating questions.");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (index, value) => {
    setAnswers((prev) => ({ ...prev, [index]: value }));
  };

  const submitAnswers = () => {
    const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;
    if (answeredCount < questions.length) {
      toast.error("Please answer all questions!");
      return;
    }
    const score = Math.floor(Math.random() * 30) + 70;
    console.log("Submitted Answers:", answers);
    toast.success(`Interview submitted! Score: ${score}/100`);
  };

  const roles = [
    { value: "Frontend Developer", icon: "🎨" },
    { value: "Backend Developer", icon: "⚙️" },
    { value: "Full Stack Developer", icon: "🚀" },
    { value: "DevOps Engineer", icon: "🔧" },
    { value: "Data Scientist", icon: "📊" },
  ];

  const answeredCount = Object.keys(answers).filter(k => answers[k]?.trim()).length;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-violet-50/40 py-12 px-4">
      <div className="max-w-3xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 text-indigo-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
            <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            AI POWERED
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight mb-3">
            Mock Interview
          </h1>
          <p className="text-gray-500 text-base max-w-md mx-auto">
            Generate customized interview questions based on your selected role and practice your answers.
          </p>
        </div>

        {/* Role Selection Card */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mb-6">
          <h2 className="text-sm font-bold text-gray-700 uppercase tracking-wider mb-4">
            Select Your Role
          </h2>

          {/* Role Pills */}
          <div className="flex flex-wrap gap-2 mb-5">
            {roles.map((r) => (
              <button
                key={r.value}
                onClick={() => setRole(r.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150 ${
                  role === r.value
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200"
                    : "bg-gray-50 text-gray-600 border-gray-200 hover:border-indigo-300 hover:text-indigo-600"
                }`}
              >
                <span>{r.icon}</span>
                {r.value}
              </button>
            ))}
          </div>

          {/* Start Button */}
          <button
            onClick={startInterview}
            disabled={loading || !role}
            className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-600 text-white font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" />
                  <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Generating Questions...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                Start Interview
              </>
            )}
          </button>
        </div>

        {/* Error */}
        {errorMSG && (
          <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6">
            <svg className="w-4 h-4 fill-red-500 flex-shrink-0" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
            </svg>
            <p className="text-sm font-medium">{errorMSG}</p>
          </div>
        )}

        {/* Questions */}
        {questions.length > 0 && (
          <div className="flex flex-col gap-4">

            {/* Progress Bar */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <span className="text-sm font-semibold text-gray-700">
                  Progress
                </span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-2 bg-gradient-to-r from-indigo-500 to-violet-600 rounded-full transition-all duration-500"
                    style={{ width: `${(answeredCount / questions.length) * 100}%` }}
                  />
                </div>
              </div>
              <span className="text-sm font-bold text-indigo-600 ml-4">
                {answeredCount}/{questions.length}
              </span>
            </div>

            {/* Question Cards */}
            {questions.map((question, index) => (
              <div key={index} className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
                <div className="flex gap-4 items-start mb-4">
                  <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-200">
                    {index + 1}
                  </div>
                  <p className="font-semibold text-gray-800 leading-relaxed pt-1">
                    {question}
                  </p>
                </div>

                <textarea
                  rows="3"
                  placeholder="Write your answer here..."
                  value={answers[index] || ""}
                  onChange={(e) => handleAnswerChange(index, e.target.value)}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 placeholder-gray-300 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-50 resize-none transition"
                />

                {answers[index]?.trim() && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                    <span className="text-xs text-emerald-600 font-medium">Answer saved</span>
                  </div>
                )}
              </div>
            ))}

            {/* Submit */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800">Ready to submit?</p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {answeredCount < questions.length
                    ? `${questions.length - answeredCount} question(s) remaining`
                    : "All questions answered ✓"}
                </p>
              </div>
              <button
                onClick={submitAnswers}
                className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-emerald-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200"
              >
                <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Submit Answers
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
    </>
  );
}
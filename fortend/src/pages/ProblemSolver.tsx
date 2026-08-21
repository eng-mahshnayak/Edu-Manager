import React, { useState, useRef } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  Box,
  Card,
  Typography,
  Button,
  CircularProgress,
  TextField,
  IconButton,
  Tooltip,
  Alert,
  Divider,

} from "@mui/material";
import {
  AutoAwesome,
  AttachFile,

  VideoLibrary,
  Clear,
  Download,
  Share,
} from "@mui/icons-material";

// ============ Types ============
interface SolutionSection {
  problem: string;
  steps: string[];
  finalAnswer: string;
  keyConcept: string;
  additionalTips: string;
}

interface SolutionResponse {
  success: boolean;
  data: {
    problem: string;
    solution: SolutionSection;
    rawSolution: string;
    type: string;
    fileCount: number;
  };
}

// ============ Main Component ============
const ProblemSolver: React.FC = () => {
  // ----- State -----
  const [problem, setProblem] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [solution, setSolution] = useState<SolutionSection | null>(null);
  const [rawSolution, setRawSolution] = useState("");


  console.log(rawSolution);
  
  const [filePreviews, setFilePreviews] = useState<string[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // ----- File Handlers -----
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length + files.length > 5) {
      toast.error("Maximum 5 files allowed");
      return;
    }

    setFiles((prev) => [...prev, ...selectedFiles]);

    // Create previews
    const newPreviews = selectedFiles.map((file) => {
      if (file.type.startsWith("image/")) {
        return URL.createObjectURL(file);
      } else {
        return "video";
      }
    });
    setFilePreviews((prev) => [...prev, ...newPreviews]);

    toast.success(`${selectedFiles.length} file(s) added`);
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
    if (filePreviews[index] && filePreviews[index] !== "video") {
      URL.revokeObjectURL(filePreviews[index]);
    }
    setFilePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  // ----- Submit Problem -----
  const handleSubmit = async () => {
    if (!problem.trim() && files.length === 0) {
      toast.error("Please type a problem or upload a file");
      return;
    }

    setLoading(true);
    setSolution(null);
    setRawSolution("");

    try {
      const formData = new FormData();
      formData.append("problem", problem);
      formData.append("type", files.length > 0 ? "multimodal" : "text");

      files.forEach((file) => {
        formData.append("files", file);
      });

      const response = await axios.post<SolutionResponse>(
        "http://localhost:5000/api/problem-solver/solve",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        setSolution(response.data.data.solution);
        setRawSolution(response.data.data.rawSolution);
        toast.success("Problem solved! 🎉");
      } else {
        throw new Error("Failed to get solution");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // ----- Clear All -----
  const clearAll = () => {
    setProblem("");
    setFiles([]);
    setFilePreviews([]);
    setSolution(null);
    setRawSolution("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ----- Download Solution -----
  const downloadSolution = () => {
    if (!solution) return;
    const content = `
📝 Problem: ${solution.problem}

📚 Step-by-Step Solution:
${solution.steps.map((s, i) => `${i + 1}. ${s}`).join("\n")}

✅ Final Answer: ${solution.finalAnswer}

💡 Key Concept: ${solution.keyConcept}

📖 Additional Tips: ${solution.additionalTips}
    `;

    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "solution.txt";
    link.click();
  };

  // ----- Share Solution -----
  const shareSolution = () => {
    if (!solution) return;
    const text = `
Problem: ${solution.problem}
Final Answer: ${solution.finalAnswer}
Key Concept: ${solution.keyConcept}
    `.trim();

    if (navigator.share) {
      navigator.share({
        title: "Problem Solution",
        text: text,
      });
    } else {
      navigator.clipboard.writeText(text);
      toast.success("Copied to clipboard!");
    }
  };

  // ----- Render -----
  return (
    <Box
      sx={{
        minHeight: "100vh",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, md: 3 },
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating decorations */}
      <Box
        sx={{
          position: "absolute",
          top: "10%",
          left: "5%",
          fontSize: 60,
          opacity: 0.12,
          transform: "rotate(-10deg)",
          animation: "float 8s ease-in-out infinite",
        }}
      >
        🤔
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "15%",
          right: "8%",
          fontSize: 80,
          opacity: 0.10,
          transform: "rotate(15deg)",
          animation: "float 10s ease-in-out infinite reverse",
        }}
      >
        💡
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: "40%",
          right: "20%",
          fontSize: 50,
          opacity: 0.12,
          animation: "float 12s ease-in-out infinite",
        }}
      >
        ✨
      </Box>

      <Box sx={{ maxWidth: 1000, mx: "auto", position: "relative", zIndex: 1 }}>
        {/* Header */}
        <Box mb={4} textAlign="center">
          <Typography
            variant="h3"
            fontWeight="extrabold"
            sx={{
              color: "white",
              textShadow: "0 4px 20px rgba(0,0,0,0.6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
            }}
          >
            <AutoAwesome sx={{ fontSize: 50, color: "#60a5fa" }} />
            AI Problem Solver
            <AutoAwesome sx={{ fontSize: 50, color: "#60a5fa" }} />
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)" }}>
            Type your problem, upload images, or videos – AI will solve it step-by-step!
          </Typography>
        </Box>

        {/* Input Card */}
        <Card
          sx={{
            p: 4,
            mb: 4,
            borderRadius: 4,
            background: "rgba(255,255,255,0.08)",
            backdropFilter: "blur(15px)",
            border: "1px solid rgba(255,255,255,0.12)",
            boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
          }}
        >
          {/* Problem Text */}
          <TextField
            fullWidth
            multiline
            rows={4}
            variant="outlined"
            label="✏️ Type your problem or question..."
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g., Solve 2x + 3 = 7, Explain photosynthesis, What is the capital of France?..."
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                color: "white",
                "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                "&:hover fieldset": { borderColor: "rgba(255,255,255,0.5)" },
                "&.Mui-focused fieldset": { borderColor: "#3b82f6" },
              },
              "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
              "& .MuiInputLabel-root.Mui-focused": { color: "#60a5fa" },
            }}
          />

          {/* File Upload */}
          <Box display="flex" alignItems="center" gap={2} mb={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AttachFile />}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { borderColor: "rgba(255,255,255,0.6)" },
              }}
            >
              Upload Files (Images/Videos)
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                multiple
                hidden
                onChange={handleFileChange}
              />
            </Button>
            <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.6)" }}>
              Max 5 files, 10MB each
            </Typography>
          </Box>

          {/* File Previews */}
          {filePreviews.length > 0 && (
            <Box display="flex" gap={2} flexWrap="wrap" mb={2}>
              {filePreviews.map((preview, index) => (
                <Box key={index} position="relative">
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: 2,
                      overflow: "hidden",
                      border: "1px solid rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    {preview === "video" ? (
                      <VideoLibrary sx={{ color: "white", fontSize: 40 }} />
                    ) : (
                      <img
                        src={preview}
                        alt={`Upload ${index}`}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    )}
                  </Box>
                  <IconButton
                    size="small"
                    onClick={() => removeFile(index)}
                    sx={{
                      position: "absolute",
                      top: -8,
                      right: -8,
                      background: "#ef4444",
                      color: "white",
                      "&:hover": { background: "#dc2626" },
                      width: 20,
                      height: 20,
                    }}
                  >
                    <Clear sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          {/* Action Buttons */}
          <Box display="flex" gap={2} flexWrap="wrap">
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              sx={{
                background: "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
                color: "white",
                fontWeight: "bold",
                py: 1.5,
                px: 4,
                "&:hover": {
                  background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                },
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "white" }} /> : "🔍 Solve Problem"}
            </Button>

            <Button
              variant="outlined"
              onClick={clearAll}
              sx={{
                color: "white",
                borderColor: "rgba(255,255,255,0.3)",
                "&:hover": { borderColor: "rgba(255,255,255,0.6)" },
              }}
            >
              Clear All
            </Button>
          </Box>
        </Card>

        {/* Solution Display */}
        {loading ? (
          <Box display="flex" justifyContent="center" py={10}>
            <Box textAlign="center">
              <CircularProgress sx={{ color: "white" }} />
              <Typography sx={{ color: "white", mt: 2 }}>
                Analyzing your problem... 🤔
              </Typography>
            </Box>
          </Box>
        ) : solution ? (
          <Card
            sx={{
              p: 4,
              borderRadius: 4,
              background: "rgba(255,255,255,0.07)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.10)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.4)",
              color: "white",
            }}
          >
            {/* Action Buttons */}
            <Box display="flex" justifyContent="flex-end" gap={2} mb={3}>
              <Tooltip title="Download Solution">
                <IconButton onClick={downloadSolution} sx={{ color: "#60a5fa" }}>
                  <Download />
                </IconButton>
              </Tooltip>
              <Tooltip title="Share Solution">
                <IconButton onClick={shareSolution} sx={{ color: "#60a5fa" }}>
                  <Share />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Problem */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#93bbfc" }}>
                📝 Problem:
              </Typography>
              <Typography variant="body1" sx={{ color: "#e0e0e0", fontSize: "1.1rem" }}>
                {solution.problem}
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Steps */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#93bbfc" }}>
                📚 Step-by-Step Solution:
              </Typography>
              {solution.steps.length > 0 ? (
                solution.steps.map((step, index) => (
                  <Box key={index} sx={{ mt: 1, p: 2, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 2 }}>
                    <Typography variant="body1" sx={{ color: "#e0e0e0" }}>
                      <strong>Step {index + 1}:</strong> {step}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography sx={{ color: "rgba(255,255,255,0.6)", fontStyle: "italic" }}>
                  Steps will appear here...
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Final Answer */}
            <Box mb={3}>
              <Typography variant="h6" fontWeight="bold" sx={{ color: "#4ade80" }}>
                ✅ Final Answer:
              </Typography>
              <Typography variant="body1" sx={{ color: "#e0e0e0", fontSize: "1.1rem" }}>
                {solution.finalAnswer}
              </Typography>
            </Box>

            <Divider sx={{ my: 3, borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Key Concept */}
            {solution.keyConcept && (
              <Box mb={3}>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#fbbf24" }}>
                  💡 Key Concept:
                </Typography>
                <Typography variant="body1" sx={{ color: "#e0e0e0" }}>
                  {solution.keyConcept}
                </Typography>
              </Box>
            )}

            {/* Additional Tips */}
            {solution.additionalTips && (
              <Box>
                <Typography variant="h6" fontWeight="bold" sx={{ color: "#60a5fa" }}>
                  📖 Additional Tips:
                </Typography>
                <Typography variant="body1" sx={{ color: "#e0e0e0" }}>
                  {solution.additionalTips}
                </Typography>
              </Box>
            )}
          </Card>
        ) : (
          <Alert severity="info" sx={{ bgcolor: "rgba(255,255,255,0.05)", color: "white", border: "1px solid rgba(255,255,255,0.1)" }}>
            Type your problem or upload a file, then click "Solve Problem" to get an AI-powered solution! 🚀
          </Alert>
        )}
      </Box>

      {/* Animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
      `}</style>
    </Box>
  );
};

export default ProblemSolver;
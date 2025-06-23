// Test file to verify imports
import { mentorsAPI, bookingsAPI } from "../../../services/api";
import { useAuth } from "../../../contexts/AuthContext";
import ProtectedRoute from "../../../components/ProtectedRoute";

console.log("Imports working:", { mentorsAPI, bookingsAPI, useAuth, ProtectedRoute }); 
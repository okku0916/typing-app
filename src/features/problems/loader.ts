import rawProblems from "@/data/problems.json";
import { parseProblemsData } from "@/features/problems/schema";

export const problemsData = parseProblemsData(rawProblems);

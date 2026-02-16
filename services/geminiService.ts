
import { GoogleGenAI } from "@google/genai";

export const generateFeedback = async (
  studentName: string, 
  subject: string, 
  grades: { name: string; value: string }[]
): Promise<string> => {
  // Inicialización directa según directrices
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const gradesText = grades.map(g => `${g.name}: ${g.value}`).join(', ');
  const prompt = `Como profesor, genera un breve comentario de retroalimentación constructiva para el estudiante ${studentName} en el área de ${subject}. Sus notas en las actividades recientes son: ${gradesText}. Las notas posibles son AD (Excelente), A (Muy Bueno), B (Regular), C (Necesita mejorar). Mantén el tono profesional y motivador. Máximo 100 palabras.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Acceso a la propiedad .text según directrices (no es un método)
    return response.text || "No se pudo generar retroalimentación en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Nota: Para generar comentarios con IA, la aplicación debe estar conectada a internet y tener una API KEY válida configurada.";
  }
};

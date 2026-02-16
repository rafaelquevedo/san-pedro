
import { GoogleGenAI } from "@google/genai";

export const generateFeedback = async (
  studentName: string, 
  subject: string, 
  grades: { name: string; value: string }[]
): Promise<string> => {
  // Verificación de seguridad para evitar que la app se rompa si no hay proceso o API KEY
  const apiKey = typeof process !== 'undefined' ? process.env.API_KEY : '';
  
  if (!apiKey) {
    return "Nota: La API KEY no está configurada. Para usar la IA, asegúrate de configurar las variables de entorno en Vercel/Netlify.";
  }

  const ai = new GoogleGenAI({ apiKey });
  
  const gradesText = grades.map(g => `${g.name}: ${g.value}`).join(', ');
  const prompt = `Como profesor, genera un breve comentario de retroalimentación constructiva para el estudiante ${studentName} en el área de ${subject}. Sus notas en las actividades recientes son: ${gradesText}. Las notas posibles son AD (Excelente), A (Muy Bueno), B (Regular), C (Necesita mejorar). Mantén el tono profesional y motivador. Máximo 100 palabras.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "No se pudo generar retroalimentación en este momento.";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Error al conectar con la IA para generar el reporte.";
  }
};

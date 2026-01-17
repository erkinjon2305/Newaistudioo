
import { GoogleGenAI, Type } from "@google/genai";
import { Transaction, TransactionType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getFinancialAdvice = async (transactions: Transaction[], balance: number) => {
  if (!process.env.API_KEY) return "AI tahlili uchun API kalit zarur.";

  const summary = transactions.reduce((acc, t) => {
    if (t.type === TransactionType.INCOME) acc.income += t.amount;
    else acc.expense += t.amount;
    return acc;
  }, { income: 0, expense: 0 });

  const prompt = `
    Foydalanuvchi moliyaviy ma'lumotlari:
    - Jami daromad: ${summary.income} so'm
    - Jami xarajat: ${summary.expense} so'm
    - Joriy balans: ${balance} so'm
    - Oxirgi xarajatlar soni: ${transactions.length}
    
    Ushbu ma'lumotlar asosida foydalanuvchiga qisqa, 2-3 jumlali motivatsion va aqlli maslahat ber. 
    Maslahat faqat o'zbek tilida bo'lsin.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Hozircha maslahat berishning imkoni bo'lmadi.";
  }
};

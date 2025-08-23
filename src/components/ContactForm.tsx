"use client";

import { useState } from "react";
import { apiPost, API_ENDPOINTS, handleApiError } from "@/lib/api";
import { isValidEmail } from "@/lib/utils";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "general", // 新增類型欄位
    title: "", // 新增標題欄位
    content: "", // 將 message 改為 content
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    // 如果選擇的是「遊戲、輔具提議」類型，自動填入預設內容
    if (name === "type" && value === "game_aid_suggestion") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        content: "教材、年級、句型/單字、希望增加或投放的電子教具",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.type.trim() ||
      !formData.title.trim() ||
      !formData.content.trim()
    ) {
      alert("請填寫所有欄位");
      return;
    }

    if (!isValidEmail(formData.email)) {
      alert("請輸入有效的 Email 地址");
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const result = await apiPost(API_ENDPOINTS.CONTACT, formData);

      if (result.success) {
        setSubmitStatus("success");
        setFormData({
          name: "",
          email: "",
          type: "general",
          title: "",
          content: "",
        });
      } else {
        setSubmitStatus("error");
        console.error("API Error:", result.error);
      }
    } catch (error) {
      setSubmitStatus("error");
      console.error("Submit Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-2xl font-semibold text-black mb-6">聯絡我們</h3>

      {submitStatus === "success" && (
        <div className="mb-6 p-4 bg-accent-green border border-accent-green text-black rounded-lg">
          訊息已成功送出！我們會盡快回覆您。
        </div>
      )}

      {submitStatus === "error" && (
        <div className="mb-6 p-4 bg-secondary-pink border border-secondary-pink text-black rounded-lg">
          發送失敗，請稍後再試或直接寄送 Email 給我們。
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-black mb-2"
          >
            姓名 *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
            placeholder="請輸入您的姓名"
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-black mb-2"
          >
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
            placeholder="請輸入您的 Email"
          />
        </div>

        <div>
          <label
            htmlFor="type"
            className="block text-sm font-medium text-black mb-2"
          >
            類型 *
          </label>
          <select
            id="type"
            name="type"
            value={formData.type}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
          >
            <option value="general">一般詢問</option>
            <option value="technical">技術支援</option>
            <option value="feedback">意見回饋</option>
            <option value="cooperation">合作提案</option>
            <option value="game_aid_suggestion">遊戲、輔具提議</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-black mb-2"
          >
            標題 *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent"
            placeholder="請輸入標題"
          />
        </div>

        <div>
          <label
            htmlFor="content"
            className="block text-sm font-medium text-black mb-2"
          >
            內容 *
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            required
            rows={5}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:border-transparent resize-vertical"
            placeholder="請輸入您的訊息內容"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-secondary-pink hover:bg-white hover:text-primary-blue-dark text-black font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-secondary-pink focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 border-2 border-transparent hover:border-primary-blue-dark"
        >
          {isSubmitting ? "發送中..." : "發送訊息"}
        </button>
      </form>
    </div>
  );
}

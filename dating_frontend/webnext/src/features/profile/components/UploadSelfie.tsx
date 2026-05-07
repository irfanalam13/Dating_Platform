"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, ImagePlus, X, Loader2, Send, Sparkles } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { showSuccess, showError } from "@/shared/utils/toast";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "framer-motion";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function UploadSelfie() {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  
  // ✅ Fixed declaration to match inputRef used elsewhere
  const inputRef = useRef<HTMLInputElement>(null);

  // Example mutation: replace with your actual API hook/function
  const mutation = useMutation({
    mutationFn: async (formData: FormData) => {
      // return api.post('/posts/create', formData);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Mock API delay
      return { success: true, message: "Selfie posted successfully!" };
    },
  });

  const validateFile = (selectedFile: File): boolean => {
    if (!selectedFile.type.startsWith("image/")) {
      showError("Invalid file type. Please select an image.");
      return false;
    }
    if (selectedFile.size > MAX_FILE_SIZE) {
      showError("File is too large. Maximum size is 5MB.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const selectedFile = e.dataTransfer.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
    }
  };

  const clearSelection = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setFile(null);
    setPreviewUrl(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("caption", caption);

    mutation.mutate(formData, {
      onSuccess: (data: any) => {
        showSuccess(data?.message || "Posted successfully!");
        clearSelection();
        setCaption("");
      },
      onError: (err: any) => {
        showError("Failed to upload. Please try again.");
      },
    });
  };

  return (
    <div className="max-w-xl mx-auto p-6 mt-8">
      <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-gray-200/50 dark:border-zinc-800/50 shadow-2xl p-8 transition-all">
        
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-950/30 rounded-2xl text-indigo-600 dark:text-indigo-400">
            <Sparkles size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">New Post / Selfie</h1>
            <p className="text-sm text-gray-500 dark:text-zinc-400">Upload and share your latest selfie with the world.</p>
          </div>
        </div>

        {/* Upload Box or Preview */}
        {!previewUrl ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className={cn(
              "border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all duration-300",
              "border-gray-200 dark:border-zinc-700 bg-gray-50/50 dark:bg-zinc-800/20",
              "hover:border-indigo-500 hover:bg-indigo-50/10 dark:hover:border-indigo-500"
            )}
          >
            <input
              type="file"
              accept="image/*"
              ref={inputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="flex flex-col items-center space-y-4">
              <div className="p-4 bg-white dark:bg-zinc-800 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-700">
                <UploadCloud size={32} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">
                  Choose an image or drag & drop here
                </p>
                <p className="text-xs text-gray-400 dark:text-zinc-500 mt-1">
                  Supports JPG, PNG or WEBP (Max 5MB)
                </p>
              </div>
              <button
                className="px-4 py-2 text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 rounded-xl hover:bg-indigo-100/50 transition-colors pointer-events-none"
              >
                Browse File
              </button>
            </div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative group rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-inner bg-zinc-50 dark:bg-zinc-800/50 p-3 flex flex-col items-center justify-center gap-4"
          >
            <button
              onClick={clearSelection}
              className="absolute top-5 right-5 p-2 bg-black/60 hover:bg-black text-white rounded-full backdrop-blur-md transition-all shadow"
              aria-label="Remove image"
            >
              <X size={18} />
            </button>
            
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-72 object-cover rounded-xl shadow-md border border-gray-100 dark:border-zinc-700"
            />
          </motion.div>
        )}

        {/* Caption Input */}
        <div className="mt-6 space-y-3">
          <label className="text-xs font-semibold text-gray-500 dark:text-zinc-400 uppercase tracking-wider">
            Caption
          </label>
          <textarea
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="How are you feeling today?"
            className="w-full px-4 py-3 bg-gray-50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-2xl text-gray-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all text-sm"
            rows={3}
          />
        </div>

        {/* Action Button */}
        <button
          onClick={handleUpload}
          disabled={!file || mutation.isPending}
          className={cn(
            "w-full mt-6 py-3 px-5 rounded-2xl text-sm font-semibold transition-all shadow-lg flex justify-center items-center gap-2 text-white",
            !file || mutation.isPending
              ? "bg-gray-300 dark:bg-zinc-800 text-gray-500 dark:text-zinc-500 cursor-not-allowed shadow-none"
              : "bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] shadow-indigo-200 dark:shadow-indigo-950/20"
          )}
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="animate-spin" size={18} />
              <span>Uploading...</span>
            </>
          ) : (
            <>
              <Send size={18} />
              <span>Post Selfie</span>
            </>
          )}
        </button>

      </div>
    </div>
  );
}

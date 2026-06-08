"use client";
import React, { useState, useRef } from "react";
import styles from "./FileUpload.module.scss";
import { UploadCloud, X, FileText } from "lucide-react";

interface UploadedFile {
  file: File;
  name: string;
  type: string;
  size: number;
}

const FileUploadComponent = ({file, setFile}: {file: UploadedFile | null; setFile: React.Dispatch<React.SetStateAction<UploadedFile | null>>}) => {
  const [fileEnter, setFileEnter] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (raw: File) => {
    setFile({
      file: raw,
      name: raw.name,
      type: raw.type,
      size: raw.size,
    });
  };

  const formatSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className={styles.container}>
      {!file ? (
        <div
          className={`${styles.dropzone} ${fileEnter ? styles.active : ""}`}
          onDragOver={(e) => { e.preventDefault(); setFileEnter(true); }}
          onDragLeave={() => setFileEnter(false)}
          onDragEnd={(e) => { e.preventDefault(); setFileEnter(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setFileEnter(false);
            const dropped = e.dataTransfer.files[0];
            if (dropped && (dropped.type === "application/json" || dropped.name.endsWith(".json"))) {
              handleFile(dropped);
            }
          }}
          onClick={() => inputRef.current?.click()}
        >
          <div className={styles.iconWrapper}>
            <UploadCloud className={styles.icon} strokeWidth={1.5} />
          </div>
          <p className={styles.primaryText}>
            Drop your file here, or <span className={styles.browse}>browse</span>
          </p>
          <p className={styles.subText}>Supports only JSON files</p>
          <input
            ref={inputRef}
            id="file"
            type="file"
            accept=".json,application/json"
            className={styles.hiddenInput}
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
            }}
          />
        </div>
      ) : (
        <div className={styles.preview}>
            <div className={styles.fileInfo}>
                <div className={styles.fileIconWrapper}>
                    <FileText className={styles.fileIcon} strokeWidth={1.5} />
                </div>
                <div className={styles.fileMeta}>
                    <span className={styles.fileName}>{file.name}</span>
                    <span className={styles.fileSize}>{formatSize(file.size)}</span>
                </div>
                <button className={styles.removeBtn} onClick={handleRemove} aria-label="Remove file">
                    <X size={16} strokeWidth={2} />
                </button>
            </div>

            <div className={styles.genericPreview}>
                <p className={styles.genericText}>No preview available for this file type.</p>
                <a href={URL.createObjectURL(file.file)} download={file.name} className={styles.downloadLink}>Download file</a>
            </div>
        </div>
      )}
    </div>
  );
};

export default FileUploadComponent;
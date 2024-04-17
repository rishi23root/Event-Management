"use client";

import React, { useCallback, useState } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { Button } from "@/components/ui/button";

// tasks of the file uploader component
// - display the image if there is one
// - allow the user to upload a new image
// - convert the image to a base64 string,

type FileUploaderProps = {
  image: string;
  onFieldChange: (image: string) => void;
};

export function FileUploader({ image, onFieldChange }: FileUploaderProps) {
  const [imageUrl, setImageUrl] = useState(image);

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result);
        } else {
          reject(new Error("Error converting file to base64"));
        }
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(file);
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        convertFileToBase64(file)
          .then((base64String) => {
            setImageUrl(base64String);
            onFieldChange(base64String);
          })
          .catch((error) => {
            console.error("Error converting file to base64:", error);
          });
      }
    },
    [onFieldChange]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className="flex-center bg-dark-3 flex h-72 cursor-pointer flex-col overflow-hidden rounded-xl bg-grey-50"
    >
      <input {...getInputProps()} className="cursor-pointer" />

      {imageUrl ? (
        <div className="flex h-full w-full flex-1 justify-center ">
          <img
            src={imageUrl}
            alt="image"
            width={250}
            height={250}
            className="w-auto object-cover "
          />
        </div>
      ) : (
        <div className="flex-center flex-col py-5 text-grey-500">
          <img
            src="/assets/icons/upload.svg"
            width={77}
            height={77}
            alt="file upload"
          />
          <h3 className="mb-2 mt-2">Drag photo here</h3>
          <p className="p-medium-12 mb-4">SVG, PNG, JPG</p>
          <Button type="button" className="rounded-full">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
}

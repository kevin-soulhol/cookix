import { Form, useFetcher } from "@remix-run/react";
import { useState } from "react";
import imageCompression from "browser-image-compression";

export default function ImgDownloader() {
    const [preview, setPreview] = useState(null);
    const [compressedSize, setCompressedSize] = useState(null);
    const [compressedFile, setCompressedFile] = useState(null);

    const handleImageUpload = async (event) => {
        const imageFile = event.target.files[0];
        if (!imageFile) return;

        // Options de compression
        const options = {
            maxSizeMB: 1, // Limite à 1 Mo
            maxWidthOrHeight: 1920, // Redimensionne si besoin
            useWebWorker: true,
        };

        try {
            // Compression
            const compressedFile = await imageCompression(imageFile, options);
            setCompressedSize((compressedFile.size / 1024 / 1024).toFixed(2) + " Mo");

            // Pour affichage d’un aperçu
            setPreview(URL.createObjectURL(compressedFile));
            setCompressedFile(compressedFile)
            console.log("____________________ici")


            // Gérer la réponse serveur...
        } catch (error) {
            console.error("Erreur de compression :", error);
        }
    }

    const handleSubmit = async () => {

        if (compressedFile) {

            // Création du FormData
            const formData = new FormData();
            formData.append("image", compressedFile, compressedFile.name);
            formData.append("_action", 'image');

            // Envoi vers votre route Remix (POST)
            const response = await fetch("/api/recipes", {
                method: "POST",
                body: formData,
            });

            console.log(response.json())
        }
    }

    return (
        <Form method="post" encType="multipart/form-data">
            <input type="file" name="image" accept="image/*" required onChange={handleImageUpload} />
            {preview && <img src={preview} alt="Aperçu compressé" style={{ maxWidth: 300 }} />}
            <button type="button" onClick={handleSubmit}>Envoyer</button>
        </Form>
    );
}

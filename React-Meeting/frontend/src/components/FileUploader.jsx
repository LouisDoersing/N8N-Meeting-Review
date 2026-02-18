import { useState } from 'react';
import './FileUploader.css';

export default function FileUploader({ onFileSelect }) {
    const [file, setFile] = useState(null);

    function handleFileChange(e) {
        if(e.target.files && e.target.files.length > 0){
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            onFileSelect(selectedFile); // Informiere Parent-Component
        }
    }

    return (
        <div className='space-y-4'>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-input"
                    accept=".pdf" // Nur docx-Dateien erlauben
                />
                <label
                    htmlFor="file-input"
                    className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg inline-block">
                </label>
            </div>

            {file && (
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Ausgewählte Datei:</h3>
                    <div className="space-y-1 text-sm">
                        <p><span className="font-medium">Name:</span> {file.name}</p>
                        <p><span className="font-medium">Größe:</span> {Math.round(file.size / 1024)} KB</p>
                        <p><span className="font-medium">Typ:</span> {file.type || 'Unbekannt'}</p>
                    </div>
                </div>
            )}

        </div>
    );
}
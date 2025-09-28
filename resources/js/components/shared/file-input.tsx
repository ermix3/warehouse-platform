import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { FileInputProps } from '@/types';
import { Loader2, Upload, X } from 'lucide-react';
import { ChangeEvent, useRef, useState } from 'react';

export function FileInput({ id, onChange, preview, className, label, accept = 'image/*', disabled = false }: Readonly<FileInputProps>) {
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [localPreview, setLocalPreview] = useState<string | null>(preview || null);
    const [isLoading, setIsLoading] = useState(false);

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        if (file) {
            setIsLoading(true);
            handleFile(file);
        }
    };

    const handleFile = (file: File | null) => {
        if (file) {
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onload = () => {
                    setLocalPreview(reader.result as string);
                    setIsLoading(false);
                };
                reader.onerror = () => {
                    setIsLoading(false);
                };
                reader.readAsDataURL(file);
            } else {
                setIsLoading(false);
            }
            onChange(file);
        } else {
            setLocalPreview(null);
            onChange(null);
            setIsLoading(false);
        }
    };

    const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true);
        } else if (e.type === 'dragleave') {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const removeFile = (e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent event from bubbling up to parent
        setLocalPreview(null);
        onChange(null);
        if (inputRef.current) {
            inputRef.current.value = '';
        }
    };

    const displayPreview = preview || localPreview;

    return (
        <div className={cn('space-y-2', className)}>
            {label && <Label htmlFor={id}>{label}</Label>}
            <div
                className={cn(
                    'relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:cursor-pointer',
                    dragActive ? 'border-primary bg-primary/10' : 'border-muted-foreground/25',
                    disabled && 'cursor-not-allowed opacity-50',
                )}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputRef.current?.click()}
                role="button"
            >
                <input
                    ref={inputRef}
                    id={id}
                    name={id}
                    type="file"
                    accept={accept}
                    className="sr-only"
                    onChange={handleFileChange}
                    disabled={disabled}
                />

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center p-6">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <p className="mt-2 text-sm text-muted-foreground">Processing image...</p>
                    </div>
                ) : displayPreview ? (
                    <div className="relative">
                        <img src={displayPreview} alt="Preview" className="max-h-48 max-w-full rounded-md object-cover" />
                        {!disabled && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full hover:cursor-pointer hover:bg-destructive/80"
                                onClick={(e) => removeFile(e)}
                            >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remove</span>
                            </Button>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center text-center">
                        <Upload className="mb-2 h-10 w-10 text-muted-foreground" />
                        <div className="text-sm text-muted-foreground">
                            <span className="font-medium text-primary">Click to upload</span> or drag and drop
                        </div>
                        <p className="text-xs text-muted-foreground">
                            {accept.includes('image/') ? 'PNG, JPG, GIF up to 10MB' : 'Any file up to 10MB'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}

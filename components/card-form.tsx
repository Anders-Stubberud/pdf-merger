import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from "react"
import { DragAndDrop } from "./ui/drag-and-drop"
import { PacmanLoader } from 'react-spinners';
import { useTheme } from "next-themes"

export function CardWithForm() {
    const fileInputRef = useRef(null);
    const [filesToMerge, setFilesToMerge] = React.useState<File[]>();
    const { theme } = useTheme();
    const [isLoading, setIsLoading] = React.useState<boolean>(false);
    const [fourOneThree, setFourOneThree] = React.useState<boolean>(false);

    const handleSelectPDFs = () => {
        (fileInputRef.current as HTMLInputElement | null)?.click();
    };

    const selectPDFs = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles: File[] = Array.from(event.target.files as FileList);
        setFourOneThree(false);
        setFilesToMerge(selectedFiles);
    };

    const mergePDFs = async () => {
        setIsLoading(true);
        const formData = new FormData();
        filesToMerge?.forEach((file: File) => {
            formData.append('files', file);
        });
        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload files');
            }
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            setIsLoading(false);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', newFileName != '' ? newFileName : 'merged_pdf');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error: any) {
            console.error('Error uploading files:', error);
            setIsLoading(false);
            setFourOneThree(true);
        }
    };

    const [newFileName, setNewFileName] = React.useState<string>('');

    const setName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewFileName(e.target.value);
    };

    return (
        <>
        {
        !isLoading?
        <div className="flex flex-col items-center justify-center">
            <Card className="w-[350px]">
                <CardHeader>
                    <CardTitle>Merge PDF&apos;s <span className="text-sm">(max 4.5MB total)</span></CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <form>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="name">Name of new file</Label>
                                <Input id="name" placeholder="Name of your merged PDF file" value={newFileName} onChange={setName}/>
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="framework">PDF files</Label>
                                <div className="relative">
                                <Button onClick={handleSelectPDFs} variant={'outline'} className="flex w-full justify-start">
                                    Upload your PDF files
                                </Button>
                                <input
                                    id="fileInput"
                                    onChange={selectPDFs}
                                    type="file"
                                    ref={fileInputRef}
                                    className="absolute inset-0 opacity-0"
                                    multiple
                                />
                            </div>
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex grow justify-center">
                    <Button onClick={mergePDFs} className={filesToMerge ? (theme === 'dark' ? 'border border-white' : 'border border-black') : 'invisible'}>Merge!</Button>
                </CardFooter>
            </Card>
            {
                filesToMerge?
                <DragAndDrop files={filesToMerge}></DragAndDrop>
                :
                fourOneThree?
                <h1>413: Payload over 4.5MB</h1>
                :
                <></>
            }
        </div>
        :
        <div className="mt-10 md:mt-20 lg:mt-24 ">
            <PacmanLoader size={50} color={theme === 'dark' ? '#ffffff' : '#000000'} />
        </div>
        }
        </>
    );
}


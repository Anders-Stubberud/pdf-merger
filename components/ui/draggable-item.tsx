import { TableCell, TableRow } from "@/components/ui/table"

interface DraggableItemInterface {
    file: File
    index: number
}

export const DraggableItem = ({file, index} : DraggableItemInterface) => {

    const trimFileNameIfNecessary = (filename: string) => {
        if (filename.length > 23) {
            return filename.substring(0, 23) + "...";
        } else {
            return filename;
        }
    };

    return (
        <TableRow className="flex flex-row justify-between">
            <TableCell>{index + 1}</TableCell>
            <TableCell className="font-medium">{ trimFileNameIfNecessary(file.name) }</TableCell>
        </TableRow>
    );

}

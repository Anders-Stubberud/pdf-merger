import * as React from 'react';
import { List, arrayMove } from 'react-movable';
import { DraggableItem } from './draggable-item';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DragAndDropInterface {
  files: File []
}

export const DragAndDrop = ({files} : DragAndDropInterface) => {

  const [items, setItems] = React.useState<any[]>([]);

  React.useEffect(() => {
    if (files.length > 0) {
      setItems(
        files.map((file: File, index: number) => ({
          key: file.name,
          index: index,
          file: file
        }))
      );
    } else {
      setItems([]);
    }
  }, [files]);

  const onChange = ({ oldIndex, newIndex }: { oldIndex: number, newIndex: number }) => {
    setItems(arrayMove(items, oldIndex, newIndex).map((item, index) => ({
      ...item,
      index: index
    })));
  };

  return (
    <>
      <TableHeader className='mt-8 w-full'>
        <TableRow className='flex flex-row justify-between'>
          <TableHead>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>Nr.</TooltipTrigger>
              <TooltipContent>
                <p>Drag to reorder the PDF&apos;s</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          </TableHead>
          <TableHead>Filename</TableHead>
        </TableRow>
      </TableHeader>
      <div className='w-full'>
        <List
            values={items}
            onChange={onChange}
            renderList={({ children, props }) => <ul {...props}>{children}</ul>}
            renderItem={({ value, props }) => (
              <li className='list-none' {...props}>
                <DraggableItem key={value.key} file={value.file} index={value.index} />
              </li>
            )}
          />
      </div>
    </>
  );
};

import { ENote } from "./interface"

export interface NoteProps {
  note: ENote
  children: any
}

export const Note  = ({note, children}:NoteProps) => <><div>
  {children}
</div></>
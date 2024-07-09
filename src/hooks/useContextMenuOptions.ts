import { useSelection } from "./useSelection";

export enum ContextMenuOptions {
  CUT = 'Cut',
  COPY = 'Copy',
  PASTE = 'Paste',
  DELETE = 'Delete',
}

export const useContextMenuOptions = () => {
  const options = [
    ContextMenuOptions.CUT,
    ContextMenuOptions.COPY,
    ContextMenuOptions.PASTE,
    ContextMenuOptions.DELETE,
  ];

  const {
    handleCut,
    handleCopy,
    handlePaste,
    handleDelete
  } = useSelection();

  const handleOptionClick = (option: ContextMenuOptions) => {
    switch (option) {
      case ContextMenuOptions.CUT:
        handleCut();
        break;
      case ContextMenuOptions.COPY:
        handleCopy();
        break;
      case ContextMenuOptions.PASTE:
        handlePaste();
        break;
      case ContextMenuOptions.DELETE:
        handleDelete();
        break;
      default:
        break;
    }
  };

  return { options, handleOptionClick };
};

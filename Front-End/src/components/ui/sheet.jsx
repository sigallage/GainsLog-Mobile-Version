import React from "react";
import { createPortal } from "react-dom";

const Sheet = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return createPortal(
    <div className="sheet-overlay" onClick={() => onOpenChange(false)}>
      <div className="sheet-content" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
};

const SheetTrigger = ({ children, onClick }) => {
  return <div onClick={onClick}>{children}</div>;
};

const SheetContent = ({ children, className = "" }) => {
  return <div className={`sheet-inner ${className}`}>{children}</div>;
};

const SheetHeader = ({ children }) => {
  return <div className="sheet-header">{children}</div>;
};

const SheetTitle = ({ children }) => {
  return <h2 className="sheet-title">{children}</h2>;
};

const SheetClose = ({ children, onClick }) => {
  return <button className="sheet-close" onClick={onClick}>{children}</button>;
};

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetClose };

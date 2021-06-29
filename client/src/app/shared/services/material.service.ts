import {ElementRef} from "@angular/core";

// @ts-ignore
declare var M;

export interface MaterialInstance {
  open(): void;

  close(): void;

  destroy(): void;
}

export interface MaterialDatePicker extends MaterialInstance {
  date?: Date;
}

export class MaterialService {
  public static toast(message: string): void {
    M.toast({html: message});
  }

  public static initializeFloatingButton(elRef: ElementRef): void {
    M.FloatingActionButton.init(elRef.nativeElement);
  }

  public static updateTextFields(): void {
    M.updateTextFields();
  }

  public static initModal(ref: ElementRef): MaterialInstance {
    return M.Modal.init(ref.nativeElement);
  }

  public static initTooltip(ref: ElementRef): MaterialInstance {
    return M.Tooltip.init(ref.nativeElement);
  }

  public static initDatePicker(ref: ElementRef, onClose: () => void): MaterialInstance {
    return M.Datepicker.init(ref.nativeElement, {
      format: 'dd.mm.yyyy',
      showClearBtn: true,
      onClose
    });
  }

  public static initTapTarget(ref: ElementRef): MaterialInstance {
    return M.TapTarget.init(ref.nativeElement);
  }
}

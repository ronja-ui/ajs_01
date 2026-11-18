/*
 * Teragrep User Interface (ajs_01)
 * Copyright (C) 2019-2026 Suomen Kanuuna Oy
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 *
 * Additional permission under GNU Affero General Public License version 3
 * section 7
 *
 * If you modify this Program, or any covered work, by linking or combining it
 * with other code, such other code is not for that reason alone subject to any
 * of the requirements of the GNU Affero GPL version 3 as long as this Program
 * is the same Program as licensed from Suomen Kanuuna Oy without any additional
 * modifications.
 *
 * Supplemented terms under GNU Affero General Public License version 3
 * section 7
 *
 * Origin of the software must be attributed to Suomen Kanuuna Oy. Any modified
 * versions must be marked as "Modified version of" The Program.
 *
 * Names of the licensors and authors may not be used for publicity purposes.
 *
 * No rights are granted for use of trade names, trademarks, or service marks
 * which are in The Program if any.
 *
 * Licensee must indemnify licensors and authors for any liability that these
 * contractual assumptions impose on licensors and authors.
 *
 * To the extent this program is licensed as part of the Commercial versions of
 * Teragrep, the applicable Commercial License may apply to this file if you as
 * a licensee so wish it.
 */
import {Component, ElementRef, input, OnDestroy, ViewChild} from '@angular/core';
import {Paragraph} from '../../../../../objects/paragraph/paragraph';
import {ReactiveFormsModule} from '@angular/forms';
import {Modal} from 'bootstrap';

@Component({
  selector: 'remove-paragraph',
  imports: [
    ReactiveFormsModule
  ],
  template: `
    <button class="btn btn-link btn-sm"
            (click)="openRemoveParagraphDialog()"
            [disabled]="disable()">
      <i class="fa-solid fa-trash-can"
         title="Clear output">
      </i>
    </button>
    <div #confirmRemoveParagraph class="modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5>Remove paragraph</h5>
          </div>
          <div class="modal-body">
            <div class="d-flex align-items-center">
                Remove paragraph?
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeRemoveParagraphDialog()">Cancel</button>
            <button type="button" class="btn btn-primary" (click)="removeAndClose()">Confirm</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RemoveParagraphView implements OnDestroy {
  removeParagraphCallback = input.required<() => void>();
  disable = input.required<boolean>();

  @ViewChild('confirmRemoveParagraph') confirmRemoveParagraph!: ElementRef<HTMLDivElement>;

  openRemoveParagraphDialog():void{
    const modal = Modal.getOrCreateInstance(this.confirmRemoveParagraph.nativeElement, {
      backdrop: 'static',
    });
    modal.show();
  }

  closeRemoveParagraphDialog():void{
    Modal.getInstance(this.confirmRemoveParagraph.nativeElement)?.hide();
  }

  removeAndClose():void{
    this.removeParagraphCallback()();
    this.closeRemoveParagraphDialog();
  }

  ngOnDestroy() {
    Modal.getInstance(this.confirmRemoveParagraph.nativeElement)?.dispose();
  }
}

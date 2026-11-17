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
import {Output} from '../../../../objects/output/output';
import {RenderNodeRootView} from '../../renderNodeRoot/renderNodeRootView';
import {Paragraph} from '../../../../objects/paragraph/paragraph';
import {Execution} from '../../../../objects/paragraph/execution/execution';
import {Toast} from 'bootstrap';

@Component({
  selector: 'action-bar',
  imports: [
    RenderNodeRootView,
  ],
  template: `
    <hr>
    <div class="d-flex align-items-center">
      <render-node-host [renderNode]="execution().executor()()"></render-node-host>
      <fieldset [disabled]="execution().executionIsOngoing()()">
        <button class="btn btn-link btn-sm"
                (click)="output().clear()">
          <i class="fas fa-eraser"
             title="Clear editor">
          </i>
        </button>
        <button class="btn btn-link btn-sm"
                (click)="paragraph().copy()">
          <i class="fa-solid fa-copy"
             title="Copy paragraph">
          </i>
        </button>
        <button class="btn btn-link btn-sm"
                (click)="copyParagraphLink()">
          <i class="fa-solid fa-link"
             title="Link to paragraph">
          </i>
        </button>
      </fieldset>
      <div class="ms-auto d-flex align-items-center">
        <render-node-host [renderNode]="execution().executionStatus()()"></render-node-host>
      </div>
    </div>
    <div class="toast-container position-fixed bottom-0 end-0 p-3">
      <div #copyParagraphLinkNotification class="toast" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header">
          <strong class="me-auto">Notification</strong>
          <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          Paragraph link copied to clipboard.
        </div>
      </div>
    </div>
    <hr>
  `
})
export class ActionBarView implements OnDestroy {
  paragraph = input.required<Paragraph>();
  output = input.required<Output>();
  execution = input.required<Execution>();

  @ViewChild('copyParagraphLinkNotification') copyParagraphLinkNotification!: ElementRef<HTMLDivElement>;

  async copyParagraphLink():Promise<void>{
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    const paragraphLink = `${baseUrl}#/notebook/${this.notebookId()}/#${this.paragraph().id()}`;
    await navigator.clipboard.writeText(paragraphLink);
    const notification = Toast.getOrCreateInstance(this.copyParagraphLinkNotification.nativeElement);
    notification.show();
  }

  private notebookId():string {
    const regex = /\/notebook\/([^/?#]+)/;
    const url = window.location.href;
    return url.match(regex)?.[1];
  }

  ngOnDestroy():void {
    Toast.getInstance(this.copyParagraphLinkNotification?.nativeElement)?.dispose();
  }
}

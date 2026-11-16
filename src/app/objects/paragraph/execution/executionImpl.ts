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
import {Execution} from './execution';
import {computed, signal, Signal, WritableSignal} from '@angular/core';
import {RenderNode} from '../../rendering/renderNode/renderNode';
import {RegisteredComponents} from '../../../ui/angular2+/componentRegistry/registeredComponents';
import {RenderNodeImpl} from '../../rendering/renderNode/renderNodeImpl';
import {Requestable} from '../../channel/requestable';

export class ExecutionImpl implements Execution {
  private readonly _requestable: Requestable;
  private readonly _startExecution:Signal<RenderNode>;
  private readonly _cancelExecution:Signal<RenderNode>;
  private readonly _executorView:WritableSignal<RenderNode>;
  private readonly _executionStatusView:Signal<RenderNode>;

  constructor(requestable: Requestable) {
    this._requestable = requestable;
    this._startExecution = signal(new RenderNodeImpl(RegisteredComponents.START_EXECUTION_VIEW,
      computed(() => ({startExecutionCallback:() => this.startExecution()}
      ))));
    this._cancelExecution = signal(new RenderNodeImpl(RegisteredComponents.CANCEL_EXECUTION_VIEW,
      computed(() => ({cancelExecutionCallback:() => this.cancelExecution()}
      ))));
    this._executorView = signal(this._startExecution());
    this._executionStatusView = signal(new RenderNodeImpl(RegisteredComponents.EXECUTION_STATUS_VIEW, computed(() => ({
      executionIsOngoing:false,
      timeInfoText:'',
      executionStatus: ''
    }))));
  }

  executionStatus(): Signal<RenderNode> {
    return this._executionStatusView;
  }

  executor(): Signal<RenderNode> {
    return this._executorView;
  }

  executionIsOngoing(): Signal<boolean> {
      throw new Error('Method not implemented.');
  }


  response(json: object): void {
  }

  private executionIsOnGoing(status:string): boolean {
    return status === 'RUNNING' || status === 'PENDING';
  }

  private startExecution():void {
    this._requestable.request({
      op:'START_EXECUTION',
      data:{}
    });
  }

  private cancelExecution():void {
    this._requestable.request({
      op:'CANCEL_EXECUTION',
      data:{}
    });
  }
}

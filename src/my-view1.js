/**
 * @license
 * Copyright (c) 2016 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
 */

import { PolymerElement, html } from '@polymer/polymer/polymer-element.js';
import { DomRepeat } from '@polymer/polymer/lib/elements/dom-repeat.js';
import { DomIf } from '@polymer/polymer/lib/elements/dom-if';
import  '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import './shared-styles.js';

class MyView1 extends PolymerElement {

  constructor() {
    super();
    this.reset();
    this.removeEmployee = this.removeEmployee.bind(this);

    this.addedName = "Anushree";
    this.addedId = "dd";
    this.addedDepartment = "UI";
    this.addedSalary = 12345;
  }

  static get properties() {
    return {
      employee: { type: Array },
      add: {type: Boolean},
      addedId: {
        type: String,
        reflectToAttribute: true,
        notify: true
      },
      addedSalary: {
        type: Number,
        reflectToAttribute: true,
        notify: true
      }
    }
  }
  static get template() {
    return html`
      <style include="shared-styles">
       
        :host {
          display: block;

          padding: 10px;
        }
        td,th{
          border:1px solid black;
          
        }
        table{
          width: 80%;
          border-collapse: collapse;
        }
        .add-popup{
          width: 40px;
          height: 40px;
          background-color: green;
        }

      </style>

      <div class="card">
        <div class="circle">1</div>
        <h1>Employee Database Table</h1>
        
        
        <table>
            <thead>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Salary</th>
                <th></th>
                <th></th>
            </thead>
            <tbody>
            <template is="dom-repeat" items="[[employees]]">
            
            <tr>
                    <td>{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.department}}</td>
                    <td>{{item.salary}}</td>
                    <td><a href='#'>Edit</a></td>
                    <td><a href='#' on-click='removeEmployee'>Delete</a></td>
                </tr>
            
            
            </template>     
            </tbody>
        </table>
        <hr/>
        <paper-button raised on-click='openDialog'>Add</paper-button>
        <paper-dialog id="dia">
            <h2>Add an Employee</h2>
            <div>
              <paper-dialog-scrollable>
                <paper-input always-float-label label="ID" value="{{addedId}}"></paper-input>
                <paper-input always-float-label label="Name" value="{{addedName}}"></paper-input>
                <paper-input always-float-label label="Department" value="{{addedDepartment}}"></paper-input>
                <paper-input always-float-label label="Salary" value="[[addedSalary]]"></paper-input>
              </paper-dialog-scrollable>
            </div>
          <div class="buttons">
            <paper-button dialog-dismiss>Cancel</paper-button>
             <paper-button dialog-confirm autofocus on-click="addEmployee">Accept</paper-button>
        </div>
      </paper-dialog>

    
      </div>
    `;
  }

 

  openDialog() {
    
    this.$.dia.open();
   
  }
  addEmployee() {
    debugger;
    var employee = {
      name: this.addedName,
      id: this.addedId,
      department: this.addedDepartment,
      salary: this.addedSalary
    }
    this.push('employees', employee);
  }

  removeEmployee(event) {
    var deleted_id = event.model.item.id;

    var index = this.employees.map(x => {
      return x.id;
    }).indexOf(deleted_id);

    console.log(index);
    debugger;
    let employees = [];
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id != deleted_id) {
        employees.push(this.employees[i])
      }
    }

    this.employees = employees;
    console.log(this.employees);
  }

  reset() {
    this.employees = [{
      name: 'Anushree',
      id: 12345,
      department: 'UI',
      salary: 12345
    },
    {
      name: 'Anushree1',
      id: 12346,
      department: 'UI',
      salary: 12346
    }]
  }

}

window.customElements.define('my-view1', MyView1);

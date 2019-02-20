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
import '@polymer/paper-checkbox/paper-checkbox.js';
import './shared-styles.js';

class MyView1 extends PolymerElement {

  constructor() {
    super();
    this.reset();
    this.removeEmployee = this.removeEmployee.bind(this);
    this.selectedArray=[];
    this.editIndex=undefined;
   
  }

  static get properties() {
    return {
      employee: { type: Array },
      add: {type: Boolean},
      selectedArray:{type:Array}
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
          border-bottom:1px solid #00000030;
          padding: 20px;
          
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


        <iron-list items="[[data]]" as="item">
           <template>
            <div tabindex$="[[tabIndex]]">
                   Name: [[item.name]]
            </div>
           </template>
        </iron-list>        

        <table>
            <thead>
                <th></th>
                <th>Employee Id</th>
                <th>Employee Name</th>
                <th>Department</th>
                <th>Salary</th>
                <th></th>
                
            </thead>
            <tbody>
            <template is="dom-repeat" items="[[employees]]">
            
            <tr>
                    <td><paper-checkbox on-click='selectedEmployee'></paper-checkbox></td>
                    <td>{{item.id}}</td>
                    <td>{{item.name}}</td>
                    <td>{{item.department}}</td>
                    <td>{{item.salary}}</td>
                    <td><paper-button raised on-click='openDialogEdit' id='editBtn'>Edit</paper-button></td>
                    
                </tr>
            
            
            </template>     
            </tbody>
        </table>
        <hr/>
        <paper-button raised on-click='openDialogAdd'>Add</paper-button>        
        <paper-button raised on-click='deleteEntity' id='deleteBtn'>Delete</paper-button>

        <paper-dialog id="diaAdd">
            <h2>Add an Employee</h2>
            <div>
              <paper-dialog-scrollable>
                <paper-input always-float-label label="ID" id ="id" placeholder="Enter Id"></paper-input>
                <paper-input always-float-label label="Name" id="name" placeholder="Enter Name"></paper-input>
                <paper-input always-float-label label="Department" id="department" placeholder="Enter Department"></paper-input>
                <paper-input always-float-label label="Salary" id="salary" placeholder="Enter Salary"></paper-input>
              </paper-dialog-scrollable>
            </div>
          <div class="buttons">
            <paper-button dialog-dismiss>Cancel</paper-button>
             <paper-button dialog-confirm autofocus on-click="addEmployee">Accept</paper-button>
        </div>
      </paper-dialog>

      <paper-dialog id="diaEdit">
            <h2>Edit Employee Data</h2>
            <div>
              <paper-dialog-scrollable>
                <paper-input always-float-label label="ID" id ="editId" placeholder="Enter Id"></paper-input>
                <paper-input always-float-label label="Name" id="editName" placeholder="Enter Name"></paper-input>
                <paper-input always-float-label label="Department" id="editDepartment" placeholder="Enter Department"></paper-input>
                <paper-input always-float-label label="Salary" id="editSalary" placeholder="Enter Salary"></paper-input>
              </paper-dialog-scrollable>
            </div>
          <div class="buttons">
            <paper-button dialog-dismiss>Cancel</paper-button>
             <paper-button dialog-confirm autofocus on-click="editEmployee">Accept</paper-button>
        </div>
      </paper-dialog>
    
      </div>
    `;
  }

  deleteEntity(){
  console.log("delete btn clicked");
   
   let employees = [];
   for(var j=0;j<this.selectedArray.length;j++){
    for (let i = 0; i < this.employees.length; i++) {
      if (this.employees[i].id != this.selectedArray[j]) {
        employees.push(this.employees[i])
      }
    }
   }

   this.employees = employees;

  console.log(this.employees);
  this.clearCheckboxes();
   debugger;
    
  }

  clearCheckboxes(){
    let checkboxes=this.shadowRoot.querySelectorAll('paper-checkbox');
    for (let i=0;i<checkboxes.length;i++){
      checkboxes[i].checked=false;
    }
    this.selectedArray=[];  
  }
  clearInput(){
    this.$.id.value=""
    this.$.name.value=""
    this.$.salary.value=""
    this.$.department.value=""
  }

  openDialogAdd() {
    
    this.$.diaAdd.open();
    this.clearInput();   
  }

  openDialogEdit(event) {
    this.$.diaEdit.open();
    this.clearInput();   
    this.editIndex=this.findIndex(event);
    console.log(this.editIndex);
  }

  selectedEmployee(event){   
    let selectedid =event.model.item.id;
    this.push("selectedArray",selectedid);
    console.log(this.selectedArray);
  }

  addEmployee() {    
    let employee = {
      name: this.$.name.value,
      id: this.$.id.value,
      department: this.$.department.value,
      salary: this.$.salary.value
    }
    this.push('employees', employee);
  }

  findIndex(event){
    let id = event.model.item.id;
    let index = this.employees.map(x => {
      return x.id;
    }).indexOf(id);
    return index;
  }

  editEmployee(event){    
      let employee = {
        name: this.$.editName.value,
        id: this.$.editId.value,
        department: this.$.editDepartment.value,
        salary: this.$.editSalary.value
      }     
    this.employees[this.editIndex]=employee;   
    console.log(this.employees);
    //  for (let i = 0; i < this.employees.length; i++) {
    //   if (this.employees[i].id != deleted_id) {
    //     employees.push(this.employees[i])
    //   }
    // }        

  }

  removeEmployee(event) {
    let deleted_id = event.model.item.id;
    let index = this.employees.map(x => {
      return x.id;
    }).indexOf(deleted_id);

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

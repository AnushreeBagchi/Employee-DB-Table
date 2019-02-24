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
import '@polymer/polymer/lib/elements/dom-repeat.js';
import '@polymer/polymer/lib/elements/dom-module.js';
import { DomIf } from '@polymer/polymer/lib/elements/dom-if';
import  '@polymer/paper-dialog/paper-dialog.js';
import '@polymer/paper-button/paper-button.js';
import '@polymer/paper-input/paper-input.js';
import '@polymer/paper-checkbox/paper-checkbox.js';
import '@polymer/iron-list/iron-list.js';
import '@polymer/iron-ajax/iron-ajax.js';
import '@polymer/iron-form/iron-form.js';
import '@polymer/iron-scroll-threshold/iron-scroll-threshold.js';


import './shared-styles.js';

class MyView1 extends PolymerElement {

  constructor() {
    super();
    this.deleteEntity = this.deleteEntity.bind(this);
    this.selectedArray=[];
    this.editIndex=undefined;
    this.lastIndexUsed=-1;   
  }

  static get properties() {
    return {
      employee: { type: Array },
      add: {type: Boolean},
      selectedArray:{type:Array},
      employees:{
        type: Array
      },
      CurrentRecord:{type: Object}

    }
  }
  static get template() {
    return html`
      <style include="shared-styles">

        iron-list {
          --iron-list-items-container: {
             margin: auto;
           };
           magin-bottom: 20px;
           background-color: light-grey;
           flex: 1 1 auto;
         }
        
         #row, #header{
          display: grid;
          grid-template-columns: 0.3fr 0.3fr 1fr 1fr 1fr 1fr 1fr;
          padding:20px;
          -webkit-box-shadow: 4px 4px 10px -8px rgba(0,0,0,0.75);
          -moz-box-shadow: 4px 4px 10px -8px rgba(0,0,0,0.75);
          box-shadow: 4px 4px 10px -8px rgba(0,0,0,0.75);

         }

         #header{
           font-weight: 700;
         }

         #editBtn, #addBtn, #deleteBtn{
          height: 2em;          
          margin:20px; 
          
          background: -moz-linear-gradient(left, #e2e2e2 0%, #fefefe 100%); /* FF3.6-15 */
          background: -webkit-linear-gradient(left, #e2e2e2 0%,#fefefe 100%); /* Chrome10-25,Safari5.1-6 */
          background: linear-gradient(to right, #e2e2e2 0%,#fefefe 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
         }

         h1{
           position:relative;          
           color:#212121a8;
           padding: 0px 7% ;
           
         }
         .col{
          width: 20%;

         }

         .checkbox,.sr{
           width: 10%;
         }


        .heading{
          display : flex;
          justify-content: space-between;
          background: -moz-linear-gradient(left, #e2e2e2 0%, #fefefe 100%); /* FF3.6-15 */
          background: -webkit-linear-gradient(left, #e2e2e2 0%,#fefefe 100%); /* Chrome10-25,Safari5.1-6 */
          background: linear-gradient(to right, #e2e2e2 0%,#fefefe 100%); /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */

        }

        div[hidden]{
          display: none !important;
        }

      </style>
      
      


      <div class="card">
       
        <div class='heading'>
            <h1>Employee Database Table</h1>
            <div>
              <paper-button raised on-click='openDialogAdd' id='addBtn'>Add</paper-button>        
              <paper-button raised on-click='deleteEntity' id='deleteBtn'>Delete</paper-button>
            </div>
        </div>
        <br>
          <div id='header'>
              <div class='checkbox'></div>
              <div  class='sr'>Sr No.</div>
              <div class='col' >Employee Id</div>
              <div class='col'>Employee Name</div>
              <div class='col'>Department</div>
              <div class='col'>Salary</div>
              <div class='col'></div>            
          </div>
        
        <iron-scroll-threshold id="ironScrollTheshold" on-lower-threshold="loadMoreData">
            <iron-list items="{{employees}}" as="item" scroll-target="ironScrollTheshold">
            <template>
              <div id='row'>
                <div class='checkbox'><paper-checkbox on-click='selectedEmployee'></paper-checkbox></div>
                <div class='sr' id='id'>{{index}}</div>
                <div class='col' id='name'>{{item.id}}</div>
                <div class='col' id='name'>{{item.name}}</div>
                <div class='col' id='department'>{{item.department}}</div>
                <div class='col' id='salary'>{{item.salary}}</div>
                <div class='col' ><paper-button raised on-click='openDialogEdit' id='editBtn'>Edit</paper-button></div>            
              </div>
            </template>
          </iron-list>
        </iron-scroll-threshold>

      <paper-dialog id="diaAdd">
        <iron-form id='addIronForm'>
        <h2>Add an Employee</h2>
            <form >
                <paper-dialog-scrollable>              
                    <paper-input always-float-label label="ID" id ="id"  placeholder="Enter Id" required></paper-input>
                    <paper-input always-float-label label="Name" id="name" placeholder="Enter Name"></paper-input>
                    <paper-input always-float-label label="Department" id="department" placeholder="Enter Department"></paper-input>
                    <paper-input always-float-label label="Salary" id="salary"  auto-validate pattern="[0-9]*" error-message="Invalid Salary" placeholder="Enter Salary"></paper-input>
                </paper-dialog-scrollable>
            </form>
        </iron-form>

        <div class="buttons">
            <paper-button dialog-dismiss>Cancel</paper-button>
            <paper-button dialog-confirm autofocus on-click="addEmployee">Accept</paper-button>
        </div>
      </paper-dialog>

      <paper-dialog id="diaEdit">
        <iron-form id='editIronForm'>
        <h2>Edit Employee Data</h2>
            <form >
                <paper-dialog-scrollable>              
                    <paper-input always-float-label label="ID" id ="editId"   value="{{CurrentRecord.id}}" readonly></paper-input>
                    <paper-input always-float-label label="Name" id="editName" placeholder="Enter Name"  value="{{CurrentRecord.name}}"></paper-input>
                    <paper-input always-float-label label="Department" id="editDepartment" placeholder="Enter Department"  value="{{CurrentRecord.department}}"></paper-input>
                    <paper-input always-float-label label="Salary" id="editSalary"  value="{{CurrentRecord.salary}}" auto-validate pattern="[0-9]*" error-message="Invalid Salary" placeholder="Enter Salary"></paper-input>
                </paper-dialog-scrollable>
            </form>
        </iron-form>

        <div class="buttons">
            <paper-button dialog-dismiss>Cancel</paper-button>
            <paper-button dialog-confirm autofocus on-click="editEmployee">Accept</paper-button>
        </div>
      </paper-dialog>
      </div>      

    `;
  }

  generate_request(self){
    //  'https://api.myjson.com/bins/ljvga/'
    fetch('http://localhost:5500/api/v1/getMembers?lastIndex='+this.lastIndexUsed)
        .then((response)=>{
            return response.json()
              }).then((result)=>{   
                var records=result.data;                   
                records.forEach(function(e) {
                  self.push('employees', e);
                });
                this.lastIndexUsed+=5;

                 
      console.log(self.employees);
    })
  }

  loadMoreData(){
    console.log('lower threshold triggered');
    var self = this;
    self.employees=[];   
    this.generate_request(self);
    setTimeout(() => {
      self.$.ironScrollTheshold.clearTriggers();
    });

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

  addEmployee() {  
    //to validate the input data
    let validateInput=this.$.addIronForm.validate();
    if(!validateInput){
      return window.alert('Invalid input data. Try again!!');
    }

    let employee = {
      name: this.$.name.value,
      id: this.$.id.value,
      department: this.$.department.value,
      salary: this.$.salary.value
    }
    this.unshift('employees', employee);
    this.shadowRoot.querySelector('iron-list').fire('iron-resize');
    debugger;
  }

  findIndex(event){
    let id = event.model.item.id;
    let index = this.employees.map(x => {
      return x.id;
    }).indexOf(id);
    return index;
  }

  openDialogEdit(event) {
    this.$.diaEdit.open();   
    this.editIndex=this.findIndex(event);
    console.log(this.editIndex);
    this.CurrentRecord={
      id: this.employees[this.editIndex].id,
      name: this.employees[this.editIndex].name,
      department: this.employees[this.editIndex].department,
      salary:this.employees[this.editIndex].salary
    }
    
    
  }

  editEmployee(event){        
    let validateInput=this.$.editIronForm.validate();
    if(!validateInput){
      this.clearInput();
      return window.alert('Invalid input data. Try again!!');
    }
    this.clearInput();
    let employees=[];
    let employee = {
      name: this.$.editName.value,
      id: this.$.editId.value,
      department: this.$.editDepartment.value,
      salary: this.$.editSalary.value
    };     
      
    employees = [...this.employees];
    employees.splice(this.editIndex,1);
    employees.splice(this.editIndex, 0, employee);
    this.set('employees', employees);
    //this.employees = employees 
  }

  selectedEmployee(event){   
    let selectedid =event.model.item.id;
    this.push("selectedArray",selectedid);
    console.log(this.selectedArray);
  }

  deleteEntity(){
    let sel_arr=this.selectedArray;
    let employees = [];
    if(sel_arr.length!=0){
      employees = this.employees.filter(function(x) {
        let inc=sel_arr.includes(x.id)
        return !inc; 
      })
     
      this.set('employees', employees);
      console.log(this.employees);
      this.clearCheckboxes();
     }
    }
}

window.customElements.define('my-view1', MyView1);


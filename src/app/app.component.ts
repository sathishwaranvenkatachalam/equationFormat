import { hasLifecycleHook } from '@angular/compiler/src/lifecycle_reflector';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'assignment';

  equation : string = "";
  result ={};
  operators = ["&&" , "||"]
  operatorsName = [ "and", "or"]
  error : boolean = false;

 char_count(str, letter) 
  {
    return (str.split(letter).length - 1);
  }


  getResult() {
    try {
     this.result = {query : this.formatStrEquation(this.equation)};
     if(!!!this.result['query']) {
      this.error = true;
     } else {
      this.error = false;
     }
    } catch(err) {
      this.error = true;
    }
  }

  splitBrackets(str) {
    let bracketDifference = this.char_count(str , '(') - this.char_count(str, ')');
    if(bracketDifference > 0) {
      return str.slice(1);
    } else if(bracketDifference < 0) {
      return str.slice(0, str.length -1)
    } else {
      return str;
    }
  }

  formatStrEquation(eqStr) {
    let res = {};
    eqStr = eqStr.replace(/\s/g, "");
    let bracketDifference = this.char_count(eqStr , '(') == this.char_count(eqStr, ')');

    // Assuming the center two characters combined as operator
    let operator = eqStr.slice(((eqStr.length/2) - 1), ((eqStr.length/2) + 1));
    let operatorIndex = this.operators.findIndex( op => op == operator);

    if(bracketDifference) {
      let halves = [];
      halves.push(eqStr.slice(0,(eqStr.length/2) - 1)); //First Half of equation
      halves.push(eqStr.slice((eqStr.length/2) + 1)); // Second Half of equation

      //Check opeartor and equation length on both sides to determine the validity
      if(this.operators.includes(operator) && (halves[0].length == halves[1].length)) {

        if(halves[0].includes('&&') || halves[0].includes('||')) {
            //remove any unwanted brackets
            halves[0] = this.splitBrackets(halves[0]);
            halves[1] = this.splitBrackets(halves[1]);

            //set the array of equations
            res[this.operatorsName[operatorIndex]] = [this.formatStrEquation(halves[0]),this.formatStrEquation(halves[1])];

        } else if(halves[0].includes('=')){
         res[this.operatorsName[operatorIndex]] = {}
         halves.forEach(half => {
            half = this.splitBrackets(half);
            let assignmentArr = half.split('=');
            res[this.operatorsName[operatorIndex]][assignmentArr[0]] = assignmentArr[1];
         })
        }
      }  else {
        return false;
      }
      return res;
    } else {
      return false;
    }
  }

}

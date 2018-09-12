/* Author : Okhaifo Oikeh */

$(document).ready(function(){
	
	$('form').submit(function (evt) {
	   evt.preventDefault(); //prevents the default action

	});
	
	
	 $("#loanamount_container").find(".message").hide();
 	$("#installmentamount_container").find(".message").hide();
	$("#interest_rate_container").find(".message").hide();
	$("#installment_interval_container").find(".message").hide();
 	$("#start_date_container").find(".message").hide();
	
     var date_input=$('input[name="startdate"]'); //our date input has the name "date"
     var container=$('.repaymentcalculator').length>0 ? $('.repaymentcalculator').parent() : "body";
     var options={
       format: 'mm/dd/yyyy',
       container: container,
       todayHighlight: true,
       autoclose: true,
     };
     date_input.datepicker(options);
	 
	
	var round=function(value, decimals) {
	   return Number(Math.round(value+'e'+decimals)+'e-'+decimals);
	 } ;
	 
	 var weekend=function(day){
		 if(day.getDay() == 6 || day.getDay() == 0){
			
			 return true;
		 }else{
			 return false;
		 }
	 }
	 
	 
	 Date.prototype.addDays = function(days) {
	     var date = new Date(this.valueOf());
	     date.setDate(date.getDate() + days);
	     return date;
	 };
	 
	 
	 isFloat = function(value){
		 if(value == "NaN" || value.toString() == "NaN")
			 return false;
		 value = parseFloat(value);
		 if(isNaN(value) == true &&  Number(value) === value && value % 1 !== 0)
			 return false;
		 else {
			 return true;
		 }
	 };
	 
	 isValidDate = function(d) {
	   return d instanceof Date && !isNaN(d);
	 };
	 
     $("#calculate").click(function(){
           
		   // get necessary values from the form elements
		 var loan_amount = $("#loanamount").val();
		 var installment_amount = $("#installmentamount").val();
		 var interest_rate = $("#interestrate").val();
		 var start_date = new Date($("#startdate").val());
		 var installment_interval = $('#installmentinterval').find(":selected").text();
		   //handling input validation and currency symbol problems
		 loan_amount = loan_amount.trim();
		 installment_amount = installment_amount.trim();
		 interest_rate = interest_rate.trim();
		 //validator values
		 var lv = true;var ia = true;var ir = true;var ii = true;var sd = true;
		 
		 //validate load_amount
		 if(loan_amount == "" || isFloat(loan_amount) == false || round(loan_amount,2) <= 0.00  || round(loan_amount,2) >= Number.POSITIVE_INFINITY){
			 lv = false;
			 $("#loanamount_container").find(".message").show();
		 }
		 else{
			 lv = true;
			 $("#loanamount_container").find(".message").hide();
			 
		 }
		 //validate installment_amount
		 if( installment_amount == "" || isFloat(installment_amount)== false || round(installment_amount,2) <= 0.00 || round(installment_amount,2) >= round(loan_amount,2) ){
		 	 ia = false;
			$("#installmentamount_container").find(".message").show();
		 }else{
			 ia = true;
			 $("#installmentamount_container").find(".message").hide();
			 
			 
		 }
		 
		 //validate interest_rate
		 if( interest_rate == "" || isFloat(interest_rate) == false  || interest_rate < 0.00 || interest_rate >= 100.00 ){
		 	ir =false;
			$("#interest_rate_container").find(".message").show();
		 }else{
			 ir = true;
			 $("#interest_rate_container").find(".message").hide();
		 }
		 
		 
		 //validate installment inteval
		 if(installment_interval == "" || (installment_interval  != "Weekly" && installment_interval  != "Daily" && installment_interval  != "Monthly") ){
		 	ii =false;
			$("#installment_interval_container").find(".message").show();
		 }else{
			 $("#installment_interval_container").find(".message").hide();
			 ii = true;
		 }
		 
		 //validate start date
		 if(isValidDate(start_date) == false){
			  sd = false;
		 	$("#start_date_container").find(".message").show();
		 }else{
			 sd = true;
			 $("#start_date_container").find(".message").hide();
		 }
		 
		 //validation complete
		 if(lv && sd && ii && ia && ir){
			 $("#loanamount_container").find(".message").hide();
		 	$("#installmentamount_container").find(".message").hide();
			$("#interest_rate_container").find(".message").hide();
			$("#installment_interval_container").find(".message").hide();
		 	$("#start_date_container").find(".message").hide();
		 
		
		 
		 //calculate
		 var duration_counter = 1;
		 var schedulelist = `
		 		 <h2 style="text-align:center;margin-top:25px;">Results of Calculation</h2>
		 		<table class="result_set table-bordered table-striped" >
		 			<thead>
						<tr>
						      <th scope="col">Event</th>
		 				     <th scope="col">Date of Payment</th>
						      <th scope="col"> $ Loan</th>
						      <th scope="col"> $ Payment</th>
						      <th scope="col"> $ Interest</th>
		 				      <th scope="col">$ Principal</th>
		 				     <th scope="col">$ Balance</th>
						    </tr>
					</thead>
		 			 <tbody>
		 		
		 
		 
		 `;
		 var grand = 0.00;
		 var interest_amount = parseFloat(0.00);
		 var principal_interval_amount = parseFloat(0.00);
		 var begin_loan_amount = parseFloat(loan_amount) ;
		 loan_amount = round(loan_amount,2);
		 var current_date = start_date;
		 
		 //date format options
		var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
		 	//assuming interest_rate is per year
			 interest_rate =(interest_rate / 100);
			 
			  var dateoutput =  null;
			 
			 while(loan_amount > 0.00){
				 
				 dateoutput =  new Date(current_date.getTime());
				  
				  //calculate the interest amount
				 if(installment_interval == "Monthly"){
					 
	   				  interest_amount= (loan_amount * interest_rate) / 12;
	   				  interest_amount =round(interest_amount,2);
					  current_date.setMonth( current_date.getMonth()+1);
					  //increment through the weekend
					  while(weekend(current_date) == true){
					   current_date = current_date.addDays(1);
				   	 }
				 }else if(installment_interval == "Weekly"){
					  interest_amount= (loan_amount * interest_rate) / (12 * 4);
					  interest_amount =round(interest_amount,2);
					  current_date = current_date.addDays(7);
					  //increment through the weekend
					  while(weekend(current_date) == true){
					   current_date = current_date.addDays(1);
				   	 }
				 }
				 else if(installment_interval == "Daily"){
	   				  interest_amount= (loan_amount * interest_rate) / (12 * 4 * 7);
	   				  interest_amount =round(interest_amount,2);
					   current_date =  current_date.addDays(1);
					
					  //increment through the weekend
					  while(weekend(current_date) == true){
					   current_date = current_date.addDays(1);
				   	 }
				 }
				  
				  
 				 //check if the installment amount > balance (loan_amount + interest_amount)
				  if((loan_amount + interest_amount) < installment_amount){
					  installment_amount = loan_amount + interest_amount;
				  }
				  
				  //deduct the interest amount from the installment pay
				  principal_interval_amount = installment_amount - interest_amount;
				  principal_interval_amount = round(principal_interval_amount,2);
				  //deduct the remaining amount from the load amount
				  loan_amount = loan_amount - principal_interval_amount;
				  loan_amount = round(loan_amount,2);
 				 
				  //make additions to the totalamount paid
				  var tmp = round(parseFloat(installment_amount) + parseFloat(grand) ,2);
				  grand = tmp
				 
				 //quick check
				  if(round(interest_amount,2) > round(installment_amount,2) ||  round(principal_interval_amount,2) < 0.00 || !isFloat(begin_loan_amount) || !isFloat(installment_amount) || !isFloat(interest_amount) || !isFloat(principal_interval_amount)){
					  alert("An unexpected error occured, Please check inputs.");
					$("#result").html("");
					return;
				  }
				  
				 
				 
				 
				  //populate the payment list
				  schedulelist += `
						<tr>
						      <th scope="row">Payment `+duration_counter+`</th>
				  		      <td>`+dateoutput.toLocaleDateString("en-US", options)+`</td>
						      <td>`+round(begin_loan_amount,2)+`</td>
				  		      <td>`+round(installment_amount,2)+`</td>
				  		      <td>`+interest_amount+`</td>
				  		      <td>`+round(principal_interval_amount,2)+`</td>
				  		      <td>`+round(loan_amount,2)+`</td>
						    </tr>
				  
				  `;
				
	
				  //increment the payment duration counter
				  duration_counter +=  1;
			 }
			 
		  //populate the payment list with the grand total	 
		  schedulelist += `
				<tr>
				      <th scope="row">Grand Total </th>
		  		      <td><b>`+dateoutput.toLocaleDateString("en-US", options)+`</b></td>
				      <td><b>`+round(begin_loan_amount,2)+`</b></td>
		  		      <td><b>`+round(grand,2)+`</b></td>
			 		<td><b>`+round(parseFloat(grand) - parseFloat(begin_loan_amount),2)+`</b></td>
		  		      <td><b>`+round(begin_loan_amount,2)+`</b></td>
			 	      <td><b>`+round(loan_amount,2)+`</b></td>
				</tr>
				</tbody>
			 	</table>
			 <h3 style="text-align:center;"> $Total is: `+grand+`</h3>
		  `;
			// console.log(schedulelist);
			 $("#result").html(schedulelist);
		 }
		   
		   
       });


	 
  })
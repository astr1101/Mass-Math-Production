
//Code in Progress as of January 13, 2017

//Code Automates question creation with/without images 

function singleset(id){
var Nightmare = require('nightmare');
var $ = require('jquery')
require('nightmare-iframe-manager')(Nightmare);
require('nightmare-upload')(Nightmare);
var Promise = require('promise');
var PythonShell = require('python-shell');
var nightmare = Nightmare({
        show : true,
        waitTimeout : 90000000,
        typeInterval: 1
    });
var options={
	args: [id]
};
PythonShell.run('polygon.py', options, function (err) {
  	
	if (err) throw err;

	var jquery=require('jquery');
	var fs = require('fs')

		// read contents of file
		
		var contents = fs.readFileSync('./polygon.'+id+'.json', 'utf-8')

		// convert to javascript object
		var qset = JSON.parse(contents);
	
	nightmare.goto('https://www.varsitytutors.com/problem-admin/new')
	//Puts in User Name
	nightmare.insert('input[id="user_login"]', 'armen.stromquist@varsitytutors.com')
	//Puts in Password
	nightmare.insert('input[id="user_password"]', '*******')
	//Clicks on Login Button
	nightmare.click('input[id="login_button"]')
	nightmare.wait('#problem_problem_subject_id')
	nightmare.select('#problem_problem_subject_id', 306) // doesn't show on screen! but is does set the value
	nightmare.select('#problem_problem_set_type', 1) // Quiz
	nightmare.wait(500)
	nightmare.click('input[name="commit"]')
	//Wait for New Question Button
	nightmare.wait('#problem_questions')
	nightmare.click('#problem_questions a')
	nightmare.wait('#mce_5')

	for (var q = 0; q < qset.questions.length; q++) {

		//nightmare.select('input[id="question_tag_306"]', 14873) 
	
		for (var exp1 = 0; exp1 < qset.questions[q].body.length; exp1++) {
				var f = qset.questions[q].body[exp1]
			
				var string_length=f.length
				var re = /%/g;
				var re2=/%/g;
				var result, begin_latex = [];
				while ( (result = re.exec(f)) ) {
				begin_latex.push(result.index);
				}

				var result2, end_latex = [];
				while ( (result2 = re2.exec(f))){
				end_latex.push(result2.index);
				}	
				var strings=[];
				if(begin_latex.length>0){
			
					var num_of_strings=2*begin_latex.length+1;
				
					strings.length=num_of_strings;
				
					strings[0]=f.slice(0,begin_latex[0])
					var k=0
					var j=0
					for(var place=0; place<strings.length;place++){
					
						if(place%2==1){
						strings[place]=f.slice(begin_latex[k]+1, end_latex[k]);
						k++;
						}
					
						if((place%2==0) && (place>0) && (place!=strings.length-1)){
						strings[place]=f.slice(end_latex[j]+1,begin_latex[j+1]);
						j++;
						}
					
						if(place==strings.length-1){
						strings[place]=f.slice(end_latex[j]+1, f.length) 
						}
				
					}
					
				}
				
				if(begin_latex.length==0){
					strings[0]=f
				}
			
				for(stuff=0; stuff<strings.length; stuff++){
			
				if (strings[stuff].match(/\\|\{|\(|\d+/)||typeof(f)=='number') // if line contains a backslash or { assume it is latex
				{
					//Click on Question Body
					nightmare.click('#mce_5')
					//Type Stuff into Latex Editor Tool
					nightmare.wait('.mce-floatpanel textarea')
					nightmare.click('.mce-floatpanel textarea')
					nightmare.insert('.mce-floatpanel textarea', strings[stuff])  
					nightmare.click('.mce-floatpanel button[role="presentation"]')
				
					// new line
					//nightmare.enterIFrame('#question_explanation_ifr')
					//nightmare.type('#tinymce', '\u000d')
					//nightmare.exitIFrame()
				} 
				else {
					//REGULAR TEXT
					if(strings[stuff]=='LINE BREAK'){
						nightmare.enterIFrame('iframe[id="question_question_ifr"]')
						nightmare.type('#tinymce', '\u000d')
						stuff=stuff+1;
						nightmare.exitIFrame()
						}
					nightmare.enterIFrame('iframe[id="question_question_ifr"]')
					nightmare.type('#tinymce', strings[stuff])
					// new line
					//nightmare.type('#tinymce', '\u000d')
					nightmare.exitIFrame()
				}
			
			}
			
		}
	
		var image='no';
		for (var exp = 0; exp < qset.questions[q].explanation.length; exp++) {
				var e = qset.questions[q].explanation[exp]
				var string_length=e.length
				var re = /%/g;
				var re2=/%/g;
				var result, begin_latex_2 = [];
				while ( (result = re.exec(e)) ) {
				begin_latex_2.push(result.index);
				}

				var result2, end_latex_2 = [];
				while ( (result2 = re2.exec(e)) ) {
				end_latex_2.push(result2.index);
				}	
				var strings2=[];
				if(begin_latex_2.length>0){
			
					var num_of_strings=2*begin_latex_2.length+1;
				
					strings2.length=num_of_strings;
				
					strings2[0]=e.slice(0,begin_latex_2[0])
					var k=0
					var j=0
					for(var place=0; place<strings2.length;place++){
						if(place%2==1){
						strings2[place]=e.slice(begin_latex_2[k]+1, end_latex_2[k]);
						k++;
						}
						if((place%2==0) && (place>0) && (place!=strings2.length-1)){
						strings2[place]=e.slice(end_latex_2[j]+1,begin_latex_2[j+1]);
						j++;
						}
						if(place==strings2.length-1){
						strings2[place]=e.slice(end_latex_2[j]+1, e.length) 
						}
						//console.log('strings2', strings2)
					}
				
				}
				
				if(begin_latex_2.length==0){
				strings2[0]=e
				}
			
			   for(place=0; place<strings2.length; place++){ 
			
				if (strings2[place].match(/\\|\{|\(|\d+/) || typeof(strings2[place])=='number'){ 
				
					if(image=='no'){
						nightmare.click('#mce_34')
						//Type Stuff into Latex Editor Tool
						nightmare.wait('.mce-floatpanel textarea')
						nightmare.click('.mce-floatpanel textarea')
						nightmare.insert('.mce-floatpanel textarea', strings2[place]) 
						nightmare.click('.mce-floatpanel button[role="presentation"]')
					}
					if(image=='yes'){
						if(lines_after_image==1){
							nightmare.evaluate(function(the_iframe, the_text, alt_text) {
							var b=$(the_iframe).contents().find('body');
							if((the_text).match(/\\|\{|\(|\d+/) || typeof(the_text)=='number'){
								b.append('<br>')
								b.append('<img src="https://latex.codecogs.com/svg.latex?{'+the_text+'}" alt="{mathcode}">')
							}
							}, '#question_explanation_ifr',strings2[place],qset.questions[q].altTextname[0]);
						lines_after_image++;
						}
					
						if(lines_after_image!=1){	
						nightmare.evaluate(function(the_iframe, the_text, alt_text) {
							var b=$(the_iframe).contents().find('body');
							if((the_text).match(/\\|\{|\(|\d+/) || typeof(the_text)=='number'){
								b.append('<img src="https://latex.codecogs.com/svg.latex?{'+the_text+'}" alt="{mathcode}">')
							
							}
							}, '#question_explanation_ifr',strings2[place],qset.questions[q].altTextname[0]);
						}
					}
				} 
		
				if (strings2[place].match(/\\|\{|\(|\d+/)==null && strings2[place]!='INSERT IMAGE HERE'){
					if(image=='no'){
						if(strings2[place]=='LINE BREAK'){
						nightmare.enterIFrame('iframe[id="question_explanation_ifr"]')
						nightmare.type('#tinymce', '\u000d')
						place=place+1;
						nightmare.exitIFrame()
						}
						nightmare.enterIFrame('iframe[id="question_explanation_ifr"]')
						nightmare.type('#tinymce', strings2[place])
						// new line
						//nightmare.type('#tinymce', '\u000d')
						nightmare.exitIFrame()
					}
				
					if(image=='yes'){
						if(lines_after_image==1){
							nightmare.evaluate(function(the_iframe, the_text, alt_text) {
							var b=$(the_iframe).contents().find('body');
								b.append('<br>')
								b.append( the_text)
						
						}, '#question_explanation_ifr',strings2[place],qset.questions[q].altTextname[0]);
						lines_after_image++;
					}
				
						if(lines_after_image!=1){
							nightmare.evaluate(function(the_iframe, the_text, alt_text) {
							var b=$(the_iframe).contents().find('body');
								b.append( the_text)
						
						}, '#question_explanation_ifr',strings2[place],qset.questions[q].altTextname[0]);
					}
				}
				
			}    	
			
				if(strings2[place] == 'INSERT IMAGE HERE'){
					var lines_after_image=1;
					var image='yes';
					//Upload a image from a file path
					nightmare.upload('input[name="question_image[image]"]', qset.questions[q].imagePaths[0])
					// click on Upload Image
					nightmare.click('input[value="Upload Image"]')
					nightmare.wait(10000)
					nightmare.evaluate(function(the_iframe, alt_text) {
					var a=$(alt_text);
					var b=$(the_iframe).contents().find('body');
					if(a.length) a = a[0];
					b.append(a)
					var c=b.find(a).width(549).height(549)
					}, '#question_explanation_ifr',qset.questions[q].altTextname[0]);
				}  
			}	
			
		}    
	  	for (var right=0; right<1; right++){
			var t = qset.questions[q].correctAnswer[right] 
			if (typeof (t) =='number' || t.match(/\\|\{/)){
						nightmare.enterIFrame('iframe[id="question_problem_question_answer_1_ifr"]')
						nightmare.click('#tinymce')
						nightmare.exitIFrame()
						nightmare.click('#mce_121')
						nightmare.wait('.mce-floatpanel textarea')
						nightmare.click('.mce-floatpanel textarea')
						nightmare.insert('.mce-floatpanel textarea', t) 
						nightmare.click('.mce-floatpanel button[role="presentation"]')
				
					}
			if(t=='INSERT IMAGE HERE'){
					nightmare.upload('input[name="question_image[image]"]', qset.questions[q].imagePaths[0])
					// click on Upload Image
					nightmare.click('input[value="Upload Image"]')
					nightmare.wait(10000)
					nightmare.evaluate(function(the_iframe, alt_text) {
					var a=$(alt_text);
					var b=$(the_iframe).contents().find('body');
					if(a.length) a = a[0];
					b.append(a)
					var c=b.find(a).width(549).height(549)
					}, '#question_problem_question_answer_1_ifr',qset.questions[q].altTextname[0]);
				}  

			
				
			if(t.match(/\\|\{/)==null && t!='INSERT IMAGE HERE'){		
						nightmare.enterIFrame('iframe[id="question_problem_question_answer_1_ifr"]')
						nightmare.type('#tinymce', t)
						nightmare.type('#tinymce', '\u000d')
						nightmare.exitIFrame()
				}
		
			}
			
			for (var wrong = 0; wrong < qset.questions[q].wrongAnswers.length; wrong++) {
				var m = qset.questions[q].wrongAnswers[wrong]    
			
					if (typeof (m) =='number' || m.match(/\\|\{/)){
						if(wrong==0){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_2_ifr"]')
							nightmare.click('#tinymce')
							nightmare.exitIFrame()
							nightmare.click('#mce_150')
							nightmare.wait('.mce-floatpanel textarea')
							nightmare.click('.mce-floatpanel textarea')
							nightmare.insert('.mce-floatpanel textarea', m) 
							nightmare.click('.mce-floatpanel button[role="presentation"]')
							}
						if(wrong==1){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_3_ifr"]')
							nightmare.click('#tinymce')
							nightmare.exitIFrame()
							nightmare.click('#mce_179')
							nightmare.wait('.mce-floatpanel textarea')
							nightmare.click('.mce-floatpanel textarea')
							nightmare.insert('.mce-floatpanel textarea', m) 
							nightmare.click('.mce-floatpanel button[role="presentation"]')
						}
						if(wrong==2){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_4_ifr"]')
							nightmare.click('#tinymce')
							nightmare.exitIFrame()
							nightmare.click('#mce_208')
							nightmare.wait('.mce-floatpanel textarea')
							nightmare.click('.mce-floatpanel textarea')
							nightmare.insert('.mce-floatpanel textarea', m) 
							nightmare.click('.mce-floatpanel button[role="presentation"]')

						}
						if(wrong==3){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_5_ifr"]')
							nightmare.click('#tinymce')
							nightmare.exitIFrame()
							nightmare.click('#mce_237')
							nightmare.wait('.mce-floatpanel textarea')
							nightmare.click('.mce-floatpanel textarea')
							nightmare.insert('.mce-floatpanel textarea', m) 
							nightmare.click('.mce-floatpanel button[role="presentation"]')

						}	
					}
				
					if(m.match(/\\|\{/)==null && m!='INSERT IMAGE HERE'){
						if(wrong==0){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_2_ifr"]')
							nightmare.type('#tinymce', m)
							nightmare.type('#tinymce', '\u000d')
							nightmare.exitIFrame()
						}
						if(wrong==1){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_3_ifr"]')
							nightmare.type('#tinymce', m)
							nightmare.type('#tinymce', '\u000d')
							nightmare.exitIFrame()
						}
						if(wrong==2){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_4_ifr"]')
							nightmare.type('#tinymce', m)
							nightmare.type('#tinymce', '\u000d')
							nightmare.exitIFrame()
						}
						if(wrong==3){
							nightmare.enterIFrame('iframe[id="question_problem_question_answer_5_ifr"]')
							nightmare.type('#tinymce', m)
							nightmare.type('#tinymce', '\u000d')
							nightmare.exitIFrame()
						}
					}

					if(m=='INSERT IMAGE'){
						if(wrong==0){
							nightmare.upload('input[name="question_image[image]"]', qset.questions[q].imagePaths[1])
							// click on Upload Image
							nightmare.click('input[value="Upload Image"]')
							nightmare.wait(10000)
							nightmare.evaluate(function(the_iframe, alt_text) {
							var a=$(alt_text);
							var b=$(the_iframe).contents().find('body');
							if(a.length) a = a[0];
							b.append(a)
							var c=b.find(a).width(549).height(549)
							}, '#question_problem_question_answer_2_ifr',qset.questions[q].altTextname[1]);
						}
						if(wrong==1){
							nightmare.upload('input[name="question_image[image]"]', qset.questions[q].imagePaths[2])
							// click on Upload Image
							nightmare.click('input[value="Upload Image"]')
							nightmare.wait(10000)
							nightmare.evaluate(function(the_iframe, alt_text) {
							var a=$(alt_text);
							var b=$(the_iframe).contents().find('body');
							if(a.length) a = a[0];
							b.append(a)
							var c=b.find(a).width(549).height(549)
							}, '#question_problem_question_answer_3_ifr',qset.questions[q].altTextname[2]);
						}
						if(wrong==2){
							nightmare.upload('input[name="question_image[image]"]', qset.questions[q].imagePaths[3])
							// click on Upload Image
							nightmare.click('input[value="Upload Image"]')
							nightmare.wait(10000)
							nightmare.evaluate(function(the_iframe, alt_text) {
							var a=$(alt_text);
							var b=$(the_iframe).contents().find('body');
							if(a.length) a = a[0];
							b.append(a)
							var c=b.find(a).width(549).height(549)
							}, '#question_problem_question_answer_4_ifr',qset.questions[q].altTextname[3]);
						}
						if(wrong==3){
							nightmare.upload('input[name="question_image[image]"]', qset.questions[q].imagePaths[4])
							// click on Upload Image
							nightmare.click('input[value="Upload Image"]')
							nightmare.wait(10000)
							nightmare.evaluate(function(the_iframe, alt_text) {
							var a=$(alt_text);
							var b=$(the_iframe).contents().find('body');
							if(a.length) a = a[0];
							b.append(a)
							var c=b.find(a).width(549).height(549)
							}, '#question_problem_question_answer_4_ifr',qset.questions[q].altTextname[4]);
						}
					}  

			}
			
			//Click Right Answer Choice
			nightmare.click('input[id="question_problem_question_answer_correct_1"]')
  
			 //Click Save Question
			nightmare.wait(400)
			nightmare.click('input[class="save_question"]')
			nightmare.wait('#problem_questions')	
		  
			
		if(q==qset.questions.length-1){
				break
			}
		
			//Click on New Question
			nightmare.click('#problem_questions a')
			nightmare.wait('#mce_5')
	}
	
	//nightmare.wait(10000)
	//console.log('set done')

	nightmare.end()
	nightmare.catch (function (error) {
		console.error(error);
	});

});
}

for(var sets=0; sets<1; sets++){
singleset(sets)
}
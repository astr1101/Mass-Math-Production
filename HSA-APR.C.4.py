from math import *
from sympy import *
import random
from mpmath import *
import fractions
from fractions import *
import sympy
import math
import sys
from random import *
import json
sys.modules['sympy.mpmath'] = mpmath
import matplotlib
from matplotlib import *
import numpy as np
from numpy import *
import matplotlib.pyplot as plt
import pylab
import itertools
from itertools import *
from mpl_toolkits.mplot3d import Axes3D
from pylab import *
from sympy.simplify.fu import *
from matplotlib.backends.backend_agg import FigureCanvasAgg as FigureCanvas
import sys
dict1={}
questions={}   
json_file=open('HSA-APR.C.4.'+str(sys.argv[1])+'.json', 'w+')
i=1
while(i<=12):
    body1="Use FOIL for the following expression."
    body2="LINE BREAK"
    a=Symbol("a")
    b=Symbol("b")
    c=randint(1,20)	
    body3="%"+str(latex((a+c*b)**2))+"%"


    ex1="The first step is to rewrite the problem as follows."
    ex2="LINE BREAK"
    ex3="%"+str(latex((a+c*b)**2))+"= \\left("+str(a+c*b)+"\\right) \\cdot \\left("+str(a+c*b)+"\\right) %"


    p=0
    answer=[]
    while(p<=2):
        answer.append(Rational(1,2)*c*sympy.binomial(2, p)*a**(2-p)*b**p)
        p=p+1
        
    ex4="LINE BREAK"
    ex5="Now we multiply the first parts of the first and second expression together."
    ex6="LINE BREAK"
    ex7="%"+str(latex(a))+"\\cdot"+str(latex(a))+"="+str(latex(a**2))+"%"
    ex8="LINE BREAK"
    ex9="Now we multiply the first term  of the first expression with the second term of the second expression."
    ex10="LINE BREAK"
    ex11="%"+str(latex(a))+"\\cdot"+str(latex(c*b))+"="+str(latex(answer[1]))
    ex12="LINE BREAK"
    ex13="Now we multiply the second term of the first expression with the first term of the second expression."
    ex14="LINE BREAK"
    ex15="%"+str(latex(a))+"\\cdot"+str(latex(c*b))+"="+str(latex(answer[1]))
    ex16="LINE BREAK"
    ex17="Now we multiply the last terms of each expression together."
    ex18="LINE BREAK"	
    ex19="%"+str(latex(c*b))+"\\cdot"+str(latex(c*b))+"="+str(latex(c*c*b*b))+"%"
    ex20="LINE BREAK"
    ex21="Now we add all these results together, and we get."
    ex22="LINE BREAK"
    ex23="%"+str(latex(a**2+answer[1]+answer[1]+c*c*b*b))+"%"

    CA=latex(a**2+answer[1]+answer[1]+c*c*b*b)
    wa1=latex(a**2)
    wa2=latex(answer[1]+c*c*b*b)
    wa3=latex(answer[1]+answer[1]+a*a)
    wa4=latex(b**2)



    dict1.setdefault('body',[]).append(body1)
    dict1.setdefault('body',[]).append(body2)
    dict1.setdefault('body',[]).append(body3)
    dict1.setdefault('explanation', []).append(ex1)
    dict1.setdefault('explanation', []).append(ex2)
    dict1.setdefault('explanation', []).append(ex3)
    dict1.setdefault('explanation', []).append(ex4)
    dict1.setdefault('explanation', []).append(ex5)
    dict1.setdefault('explanation', []).append(ex6)
    dict1.setdefault('explanation', []).append(ex7)
    dict1.setdefault('explanation', []).append(ex8)
    dict1.setdefault('explanation', []).append(ex9)
    dict1.setdefault('explanation', []).append(ex10)
    dict1.setdefault('explanation', []).append(ex11)
    dict1.setdefault('explanation', []).append(ex12)
    dict1.setdefault('explanation', []).append(ex13)
    dict1.setdefault('explanation', []).append(ex14)
    dict1.setdefault('explanation', []).append(ex15)
    dict1.setdefault('explanation', []).append(ex16)
    dict1.setdefault('explanation', []).append(ex17)
    dict1.setdefault('explanation', []).append(ex18)
    dict1.setdefault('explanation', []).append(ex19)
    dict1.setdefault('explanation', []).append(ex20)
    dict1.setdefault('explanation', []).append(ex21)
    dict1.setdefault('explanation', []).append(ex22)
    dict1.setdefault('explanation', []).append(ex23)
    dict1.setdefault('correctAnswer', []).append(CA)
    dict1.setdefault('wrongAnswers', []).append(wa1)
    dict1.setdefault('wrongAnswers', []).append(wa2)
    dict1.setdefault('wrongAnswers', []).append(wa3)	
    dict1.setdefault('wrongAnswers', []).append(wa4)	
    questions.setdefault('questions', []).append(dict1)
    dict1={}
    i=i+1
json.dump(questions,json_file, indent=4)	
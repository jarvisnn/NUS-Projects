; ; Diagnosis Program adapted from Textbook p.97
; ; TEMPLATES

; ; Sign of a symptom
(deftemplate sign
(slot symptom (type SYMBOL))
(slot organ (type SYMBOL) (default NIL))
(slot site (type SYMBOL) (default NIL)))

; ; Final Diagnosis
(deftemplate diagnosis
(slot disorder (type SYMBOL))
(slot organ (type SYMBOL) (default NIL)))

; ; Question
(deftemplate question
(slot symptom (type SYMBOL))
(slot organ (type SYMBOL) (default NIL))
(slot answer (type SYMBOL) (default NIL)))

; ; The initial facts
; ; i.e. Patient reports abdominal pain
(deffacts the-facts
(sign (symptom pain) (organ abdomen)))

; ; First, gather information about site of pain
(defrule data
?sign <- (sign (symptom pain) (organ abdomen))
=>
(printout t "Where is the pain? (1.Lower; 2.Upper; 3.Upper-Right; Others: stop) ")
(bind ?n (read))
(switch ?n (case 1 then (modify ?sign (site lower)))
	   (case 2 then (modify ?sign (site upper)))
	   (case 3 then (modify ?sign (site upper-right)))))

; ; Diagnosis of tumor of stomach
(defrule stomach-tumor
(sign (symptom pain) (organ abdomen) (site upper))
(sign (symptom poor-appetite))
(sign (symptom weight-loss))
=>
(assert (diagnosis (disorder tumor) (organ stomach))))

; ; Diagnosis of ulceration of large intestine
(defrule ulceration
(sign (symptom pain) (organ abdomen)(site lower))
(sign (symptom diarrhea))
(sign (symptom nausea))
(not (sign (symptom fever)))
=>
(assert (diagnosis (disorder ulceration) (organ large-intestine))))

; ; Diagnosis of inflammation of small intestine
(defrule inflammation
(sign (symptom pain) (organ abdomen)(site lower))
(sign (symptom diarrhea))
(sign (symptom fever))
=>
(assert (diagnosis (disorder inflammation) (organ small-intestine))))

; ; Diagnosis of inflammation of appendix
(defrule appendicitis
(sign (symptom pain) (organ abdomen) (site lower))
(sign (symptom fever))
(sign (symptom nausea))
(sign (symptom severe-pain))
=>
(assert (diagnosis (disorder inflammation) (organ appendix))))

; ; Diagnosis of stones in gall bladder
(defrule gallstones
(sign (symptom pain) (organ abdomen) (site upper-right))
(sign (symptom severe-pain))
=>
(assert (diagnosis (disorder stones) (organ gallbladder))))

; ; Diagnosis of infection of gallbladder
(defrule gallbladder
(sign (symptom pain) (organ abdomen) (site upper-right))
(sign (symptom vomiting))
(sign (symptom fever))
=>
(assert (diagnosis (disorder infection) (organ gallbladder))))

; ; 
; ; Report the diagnosis and halt
(defrule report
(diagnosis (disorder ?x) (organ ?y))
=>
(printout t "My diagnosis: " ?x " of " ?y "." crlf)
(halt))






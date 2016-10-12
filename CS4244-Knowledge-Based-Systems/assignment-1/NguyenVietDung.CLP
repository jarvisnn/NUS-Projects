; ; Program using CLIPS 6.30 as MacOS's problem.
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
?sign <- (sign (symptom pain) (organ abdomen) (site NIL))
=>
(printout t "Where is the pain? (1.Lower; 2.Upper; 3.Upper-Right; Others: stop) ")
(bind ?n (read))
(switch ?n 
    (case 1 then (modify ?sign (site lower)))
    (case 2 then (modify ?sign (site upper)))
    (case 3 then (modify ?sign (site upper-right)))))
    
    
; ; Asking question for a specific symptom
(deffunction asksymptom (?symptom)
(while TRUE do
    (printout t "Do you have " ?symptom " (Y/y or N/n)")
    (bind ?answer (read))
    (if (or (eq ?answer y) (eq ?answer Y))
    then
       (assert (question (symptom ?symptom) (answer yes) (organ abdomen)))
       (break)
    )
    (if (or (eq ?answer n) (eq ?answer N))
    then
        (assert (question (symptom ?symptom) (answer no) (organ abdomen)))
        (break)
    )
))
    
         
; ; Questions
(defrule diarrhea
(sign (symptom pain) (organ abdomen) (site lower))
(not (question (symptom diarrhea)))
=>
(asksymptom diarrhea))

(defrule fever
(sign (symptom pain) (organ abdomen) (site lower|upper-right))
(not (question (symptom fever)))
=>
(asksymptom fever))

(defrule nausea
(sign (symptom pain) (organ abdomen) (site lower))
(not (question (symptom nausea)))
=>
(asksymptom nausea))

(defrule severe-pain
(sign (symptom pain) (organ abdomen) (site lower|upper-right))
(not (question (symptom severe-pain)))
=>
(asksymptom severe-pain))

(defrule poor-appetite
(sign (symptom pain) (organ abdomen) (site upper))
(not (question (symptom poor-appetite)))
=>
(asksymptom poor-appetite))

(defrule weight-loss
(sign (symptom pain) (organ abdomen) (site upper))
(not (question (symptom weight-loss)))
=>
(asksymptom weight-loss))

(defrule vomiting
(sign (symptom pain) (organ abdomen) (site upper-right))
(not (question (symptom vomiting)))
=>
(asksymptom vomiting))


; ; Diagnosis of tumor of stomach
(defrule stomach-tumor
(sign (symptom pain) (organ abdomen) (site upper))
(question (symptom poor-appetite) (answer yes))
(question (symptom weight-loss) (answer yes))
=>
(assert (diagnosis (disorder tumor) (organ stomach))))

; ; Diagnosis of ulceration of large intestine
(defrule ulceration
(sign (symptom pain) (organ abdomen)(site lower))
(question (symptom diarrhea) (answer yes))
(question (symptom nausea) (answer yes))
(question (symptom fever) (answer no))
=>
(assert (diagnosis (disorder ulceration) (organ large-intestine))))

; ; Diagnosis of inflammation of small intestine
(defrule inflammation
(sign (symptom pain) (organ abdomen)(site lower))
(question (symptom diarrhea) (answer yes))
(question (symptom fever) (answer yes))
=>
(assert (diagnosis (disorder inflammation) (organ small-intestine))))

; ; Diagnosis of inflammation of appendix
(defrule appendicitis
(sign (symptom pain) (organ abdomen) (site lower))
(question (symptom fever) (answer yes))
(question (symptom nausea) (answer yes))
(question (symptom severe-pain) (answer yes))
=>
(assert (diagnosis (disorder inflammation) (organ appendix))))

; ; Diagnosis of stones in gall bladder
(defrule gallstones
(sign (symptom pain) (organ abdomen) (site upper-right))
(question (symptom severe-pain) (answer yes))
=>
(assert (diagnosis (disorder stones) (organ gallbladder))))

; ; Diagnosis of infection of gallbladder
(defrule gallbladder
(sign (symptom pain) (organ abdomen) (site upper-right))
(question (symptom vomiting) (answer yes))
(question (symptom fever) (answer yes))
=>
(assert (diagnosis (disorder infection) (organ gallbladder))))


; ; 
; ; Report the diagnosis and halt
(defrule report
(diagnosis (disorder ?x) (organ ?y))
=>
(printout t crlf "My diagnosis: " ?x " of " ?y "." crlf)
(printout t crlf "Do you want to run this program again? (Y/y or N/n)")
(bind ?n (read))
(switch ?n 
    (case y then (reset))    
    (case Y then (reset))
    (case n then (halt))
    (case N then (halt))
)
(printout t "****************************************" crlf crlf))

; ; No diagnosis
(defrule nodiagnosis
(not (diagnosis))

=>
(printout t crlf "Sorry, I am not able to diagnose your disease!" crlf)
(printout t crlf "Do you want to run this program again? (Y/y or N/n)")
(bind ?n (read))
(switch ?n 
    (case y then (reset))    
    (case Y then (reset))
    (case n then (halt))
    (case N then (halt))
)
(printout t "****************************************" crlf crlf))
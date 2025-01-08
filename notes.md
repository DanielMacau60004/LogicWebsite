# Notes

## Generation andUseofHintsandFeedback in a Hilbert-Style Axiomatic Proof Tutor (LOGAX)
LOGAX is a tool that helps students in constructiong Hilber-style axiomatic proofs. It provides feedback, hints at different levels, next steps, and complete solutions. Is part of a suit of tools assisting students in studying logic, such as tool to practice rewriting formulae in disjunctive or conjunctive normal forms, and to prove equivalences. Studentds can solve exercises in many different ways (not restricted to one methood). They've created a system to ajust the solution space according to the student's steps. 
"If a student takes a step in the current solution space, LOGAX can provide feedback and hints. If a student takes a step outside the current solution space, LOGAX dynamically recalculates the solution space, taking the student step as a starting point. It then uses the new solution space as the source for hints and feedback. The dynamic approach and the algorithm to recalculate the solution space are central to our solution and make it possible to always give feed back and hints to a student."
Allows proofs to be proven in both directions (bottom-top, top-down). T

The tool design is focused in interfaces to “allows students to concentrate on strategies while the software carries out procedures” (Robson et al. (2012) https://www.cimt.org.uk/journal/robson.pdf). They spend less time figuring out syntatic errors giving more focus to the construction of the actual proof. " Reducing the number of steps that a student has to perform makes it possible to focus on the elements of the task that lead to learning gains"


### Algorithmn: 


They've created a solution based on automatically proofs. They represent proofs as DAM (Directed Acyclic Multi Graphs) where vertices are statements and edged connect dependednt statements, in order to recognize different proofs. There are many ways to solve these kind of exercises, by using a DAM the order of the steps turns irrelavent. 

- Create proofs automatically: Using Boltov's Algorithm (is sound and complete).
The Bolotov algorithm is goal-driven and uses a stack of goals. We build a Directed Acyclic Graph (DAM) through steps that are divided into five groups. Below are the five steps of the algorithm:

DAM can generate multiple proofs, so they had to trim (procedure ti extract linear proofs from a DAM) the graphs to isolate single proofs in order to provide hints, generate next steps or sample solutions to students. The algorithm consists in two parts that work together, extraction(extracting a subtree from the DAM) and linearization of the subtree (convert the proof into a sequence of operations, a step by step procedure)

### Hints and Feedback:
They explored two main ways to construct hints and feedback for a proof.
- Hidden solution: Provided by the teacher or derived from a set of studeent solutions. Some of the drawbacks if the fact that is only possible to recognize solutions that are more or less equal to the stored proofs, it cannot provide hints when a student solution diverges from the these stored proofs. It can only work for a fixed set of exercises, and every time a teacher wants to add a new exercise, they must provide a possible solution (hidden). 





Hints:
To make Intelligent Tutoring Systems (ITS) effective it should have to give stepwise feedback and some form of help. 
They've started by implementent a basic hint system that was capable of providing the direction of the next step(forward/backward), the next rule to be applied and a explicit hint to how to perform the next step.
A study shows that students who receive informative feedback along with information about a subgoal are more successful in correcting mistakes than students who only receive informative feedback(https://www.tandfonline.com/doi/abs/10.1207/s15327051hci0504_2). By providing feedback that includes information about subgoals, this can help a student to undestand why a certain step is useful. They keep track of a list of subgoals while running the proof algorithmn, to provide feedback. So they've upgrated the hint system to support hints about subgoals, for example a sub-proof that the user has to do in order to reach the final goal. So the user can focus only on trying to solve that subgoal instead of thinking the the whole goal.

Feedback:
After a study on student errors, they classified the errors into 3 categories:
- oversights: Syntatic errors.
- conceptual errors: Occurs when a student fundamentally misunderstands a concept or how it should be applied.
- creative rule adaptations: A student tries to invent rules by creating, for example, a their own variant of Modus Ponens. From this **¬p→(q →¬r)** and **q** we conclude **¬p→¬r**. This happens when the student dont know how to proceed.

To genereate better feedback they've collected a list from a homework with the most common mistakes, the system can point out a mistake, and also, if possible, mention exactly which formula, subformula or set of formulae do not match with the rule chosen.


### Problems Drawbacks:
This tool does not provide fading strategies to reduce the amount of feedback according to the level of the student. Students aren't able to erase lines, the consequences is that a final proof may contain unncessary lines. Students can overuse the possibility to let the system peform a next step in a proof.


## Automated First Order Natural Deduction

## TODO
Explore Bolotov's Algorithm, based on tableux methods, to find a way to provide feedback/feedforward guidance to students when solving decution tree problems.
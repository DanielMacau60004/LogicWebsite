# Notes

## Generation andUseofHintsandFeedback in a Hilbert-Style Axiomatic Proof Tutor (LOGAX)
LOGAX is a tool that helps students in constructiong Hilber-style axiomatic proofs. It provides feedback, hints at different levels, next steps, and complete solutions. Is part of a suit of tools assisting students in studying logic, such as tool to practice rewriting formulae in disjunctive or conjunctive normal forms, and to prove equivalences. Studentds can solve exercises in many different ways (not restricted to one methood). They've created a system to ajust the solution space according to the student's steps. 
"If a student takes a step in the current solution space, LOGAX can provide feedback and hints. If a student takes a step outside the current solution space, LOGAX dynamically recalculates the solution space, taking the student step as a starting point. It then uses the new solution space as the source for hints and feedback. The dynamic approach and the algorithm to recalculate the solution space are central to our solution and make it possible to always give feed back and hints to a student."
Allows proofs to be proven in both directions (bottom-top, top-down). The tool design is focused in interfaces to “allows students to concentrate on strategies while the software carries out procedures” (Robson et al. (2012) https://www.cimt.org.uk/journal/robson.pdf). They spend less time figuring out syntatic errors giving more focus to the construction of the actual proof. " Reducing the number of steps that a student has to perform makes it possible to focus on the elements of the task that lead to learning gains"

### Missing parts:
This tool does not provide fading strategies to reduce the amount of feedback according to the level of the student.

### Algorithmn: 
They talk about two main ways to construct hints and feedback for a proof.
- Hidden solution: Provided by the teacher or derived from a set of studeent solutions. Some of the drawbacks if the fact that is only possible to recognize solutions that are more or less equal to the stored proofs, it cannot provide hints when a student solution diverges from the these stored proofs. It can only work for a fixed set of exercises, and every time a teacher wants to add a new exercise, they must provide a possible solution (hidden). 

They've created a solution based on automatically proofs. They represent proofs as DAM (Directed Acyclic Multi Graphs) where vertices are statements and edged connect dependednt statements, in order to recognize different proofs. There are many ways to solve these kind of exercises, by using a DAM the order of the steps turns irrelavent. 

- Create proofs automatically: Using Boltov's Algorithm (is sound and complete).
The Bolotov algorithm is goal-driven and uses a stack of goals. We build a Directed Acyclic Graph (DAM) through steps that are divided into five groups. Below are the five steps of the algorithm:

    -  Initialization : Initialize the algorithm by setting up the initial conditions and defining the structure of the goal stack and the Directed Acyclic Graph (DAM).
    - Goal Checking : Check if the current goal is reached. This involves verifying whether the condition or criteria associated with the goal have been satisfied within the DAM.~
    - DAM Extension : Extend the DAM by adding new nodes, relationships, or updates to the structure based on the progress made toward the goals.
    - Goal Handling : Manage goals, including potentially adding new formulae to the DAM. This includes handling special goals like `F`, which represents proving a contradiction. `F` is a shorthand and not a formal part of the language.
    - Completion and Loop Prevention : Finalize the algorithm, ensuring that any steps needed to prevent infinite looping are included. This might involve terminating specific goal processes or pruning redundant paths in the DAM.


DAM can generate multiple proofs, so they had to trim (procedure ti extract linear proofs from a DAM) the graphs to isolate single proofs in order to provide hints, generate next steps or sample solutions to students. The algorithm consists in two parts that work together, extraction(extracting a subtree from the DAM) and linearization of the subtree (convert the proof into a sequence of operations, a step by step procedure)

### Hints and Feedback:
To make Intelligent Tutoring Systems (ITS) effective it should have to give stepwise feedback and some form of help. 

A study shows that students who receive informative feedback along with information about a subgoal are more successful in correcting mistakes than students who only receive informative feedback. By providing feedback that includes information about subgoals, this can help a student to undestand why a certain step is useful. They keep track of a list of subgoals while running the proof algorithmn, to provide feedback.

After a study on student errors, they classified the errors into 3 categories:
- oversights: Syntatic errors.
- conceptual errors: When a student applies the incorrect rule.
- creative rule adaptations: A student tries to invent rules by creating, for example, a their own variant of Modus Ponens. From this **¬p→(q →¬r)** and **q** we conclude **¬p→¬r**. This happens when the student dont know how to proceed.

## Automated First Order Natural Deduction

## TODO
Explore Bolotov's Algorithm, based on tableux methods, to find a way to provide feedback/feedforward guidance to students when solving decution tree problems.
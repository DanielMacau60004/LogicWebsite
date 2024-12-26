# Notes

## Generation andUseofHintsandFeedback in a Hilbert-Style Axiomatic Proof Tutor (LOGAX)
### Algorithmn: 
They talk about two main ways to construct hints and feedback for a proof.
- Hidden solution: Provided by the teacher or derived from a set of studeent solutions. Some of the drawbacks if the fact that is only possible to recognize solutions that are more or less equal to the stored proofs, it cannot provide hints when a student solution diverges from the these stored proofs. It can only work for a fixed set of exercises, and every time a teacher wants to add a new exercise, they must provide a possible solution (hidden). 

- Create proofs automatically: Using Boltov's Algorithm.
The Bolotov algorithm is goal-driven and uses a stack of goals. We build a Directed Acyclic Graph (DAM) through steps that are divided into five groups. Below are the five steps of the algorithm:

    -  Initialization : Initialize the algorithm by setting up the initial conditions and defining the structure of the goal stack and the Directed Acyclic Graph (DAM).
    - Goal Checking : Check if the current goal is reached. This involves verifying whether the condition or criteria associated with the goal have been satisfied within the DAM.~
    - DAM Extension : Extend the DAM by adding new nodes, relationships, or updates to the structure based on the progress made toward the goals.
    - Goal Handling : Manage goals, including potentially adding new formulae to the DAM. This includes handling special goals like `F`, which represents proving a contradiction. `F` is a shorthand and not a formal part of the language.
    - Completion and Loop Prevention : Finalize the algorithm, ensuring that any steps needed to prevent infinite looping are included. This might involve terminating specific goal processes or pruning redundant paths in the DAM.

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

Explore fitch
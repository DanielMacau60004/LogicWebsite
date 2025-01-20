
LOGAX is an interactive tutoring tool designed to help students in constructing Hilbert-style axiomatic proofs\footnote{Axiomatic proofs are a kind of proof in formal deduction where each step of the proof is supported by axioms or inference rules previously established.} in propositional logic. [paper GENERATION andUseOfHintsandFeedback] This tool is capable of generating proofs to provide useful feedback and hints at any level of the exercises. It can provide the solutions for the steps to follow, as well as the complete solutions to the exercises. The team behind this tool also took into consideration aspects related to the presentation of the exercises and the way that users solve them. They focused on interfaces that allow students to concentrate on the goal of solving proofs rather than waste time figuring out and fixing syntactic errors. By shortening the number of steps and distractions required to reach the goal, students can achieve better learning outcomes.





 The team behind this project developed an algorithm for generating feedback and hints that can adapt its behavior depending on the student's resolution. Because this algorithm is driven by the user's steps, it can give more accurate information about the mistakes made by the user. This dynamic behavior enables the algorithm to consistently provide feedback and hints to the user, preventing them from becoming lost in the exercise. We will present a more concise description of the algorithm below.





Algorithm:



In Hilbert-style axiomatic proofs, it's possible to prove the same statement using different approaches. You can vary the rules and axioms applied, as well as their order of application, as described in \ref{chap:prop-decution}. LOGAX provides full support of these features.





LOGAX has a system capable of automatically generating multiple possible solutions for a given proof. The algorithm is an adaptation of the one created by Bolotov ([Bolotov's Algorithm]). Bolotov's algorithm constructs a directed acyclic multigraph (\gls{DAM}) from a list of premises and a conclusion. {This data structure can capture "all" possible steps throughout the proof that can lead to the conclusion.} In this \gls{DAM}, vertices represent statements and edges connect dependent statements (rule application). An example of a generated \gls{DAM} in LOGAX is shown in imageX, where three assumptions are given (\(p\), \(p \to q\) and \(q \to r\)) and the goal is to prove \( q \to r \vdash (p \to q) \to (p \to r) \). There are solid red edges that show how to use Modus Ponens (which is the same thing as the Implication Elimination rule) and dashed blue edges that show how to use the Deduction Theorem (which is the same thing as the Implication Introduction rule). The statements \((q \to r) \to (p \to (q \to r)) \) and \( p \to (q \to r) \to ((p \to q) \to (p \to r)) \) are axioms. This generated \gls{DAM} captures three different solutions for the same proof: one that uses axioms \(a\) and \(b\), one that uses the Deduction Theorem and axiom \(a\) and one that uses no axioms and applies the Deduction Theorem twice.












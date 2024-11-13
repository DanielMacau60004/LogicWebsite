JAVAC = javac
JAVA = java
SRC_DIR = labs\\src
BIN_DIR = out
MAIN_CLASS = main.Console
JAR_FILE = project.jar
INPUT_FILE ?=
FILES_IN_DIRS := $(shell dir /b /s "$(SRC_DIR)\\*.java" | findstr /v "\\tests\\")

all: $(JAR_FILE)

$(JAR_FILE): $(BIN_DIR)
	jar cf $(JAR_FILE) -C $(BIN_DIR) .
	jar ufe $(JAR_FILE) $(MAIN_CLASS)

$(BIN_DIR):
	@if not exist "$(BIN_DIR)" mkdir "$(BIN_DIR)"
	@$(JAVAC) -Xlint:-unchecked -d "$(BIN_DIR)" $(FILES_IN_DIRS)

run-interpreter: $(JAR_FILE)
	@echo Running Intepreter...
	@$(JAVA) -cp $(JAR_FILE) $(MAIN_CLASS)

run-compiler: $(JAR_FILE)
	@echo Running Compiler...
	@$(JAVA) -cp $(JAR_FILE) $(MAIN_CLASS)

run-both: run-interpreter run-compiler
	@echo "Running Interpreter and Compiler..."

clean:
	@rd /s /q "$(BIN_DIR)" 2>nul || echo Cleaned
	@del $(JAR_FILE) 2>nul || echo $(JAR_FILE) deleted

.PHONY: all run clean

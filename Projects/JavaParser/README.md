# Projeto
## Autores:
- Daniel Macau 60004
- Vasco Fonseca 60814 

## Fase 1
Foram implementadas todas as funcionalidades pedidas para a primeira fase. Foram tambem implementadas algumas
das funcionalidades opcionais como as string e o report de erros.

### Desvios:
Para resolver algumas ambiguidades foi necessário adicionar a instrução **end** 
para indicar o final de uma instrução let.

#### Exemplo:
```ml
let x = 1 y = x in
    let x = x+y in
        print(y*x)
    end
end
```

O simbolo de igualdade foi alterado de  = para == (como em java)
#### Exemplo:
```ml
let x = 1 y = x in
    let x = x+y in
        print(y==x)
    end
end
```

A linguagem esta feita para suportar '\n' a qualquer altura!

Foram tambem adicionados parenteses em todas as operações (semelhante ao java) por exemplo:<br>
print("hi"), println("hi"), new("hi"). 

### Strings:
Foi implementado o tipo String que funciona de forma semelhante ao python.

#### Funcionalidades:
- **"teste"**: Para criar uma instancia de uma string basta colocar aspas
- **str(1)**: Para converter qualquer (booleanos e inteiros) variavel para string
- **len("a")**: Para retornar o tamanho da string
- **"a" + str(1)**: Concatenações são válidas entre strings **sse todos os argumentos forem do tipo string**
- **"ola" == "ola"**: Comparações entre strings
- **"ola" != "adeus"**: Comparações entre strings
#### Exemplo:
```ml
let name = "Irineu" number = 60247 in
    println(name);
    println(number);
    println(name +" "+ str(number) + "!")
end
```

### Report de erros:
O report de erros está numa fase inicial! Ele já reporta todos os dipos de erros de forma clara
indicando a row e col e a função que gerou o erro.
No entando ele não reporta a lista completa de todos os erros.
#### Exemplo:
```ml
let x = 1 y = x in
    let x = x+y in
        x + "a"
    end
end
```

typechecker.errors.TypeErrorParams: Encountered: "integer, string" in expression "+" at line 3, column 11.<br>
Was expecting one of:<br>
&emsp;integer, integer -> integer<br>
&emsp;string, string -> string<br>



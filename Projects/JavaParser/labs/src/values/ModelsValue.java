package values;

import types.KnowledgeBaseType;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ModelsValue implements Value {
	private final KnowledgeBaseValue kb;
	private TableValue exp;

	private final Map<TableValue, BoolValue> rules;

	public ModelsValue(KnowledgeBaseValue kb, TableValue e) {
		this.kb = kb;
		this.exp = e;

		rules = new HashMap<>();

		//Add everything to kb
		for(TableValue t : kb.getValue())
			rules.put(t, new BoolValue(true));
		rules.put(exp, new BoolValue(false));

		System.out.println("\n\n\n\n\n\n");
		Map<TableValue, BoolValue> toAdd = new HashMap<>();
		for(Map.Entry<TableValue, BoolValue> t : rules.entrySet()) {
			Map<TableValue, BoolValue> ded = deduct(t.getKey(), t.getValue());

			BoolValue vOld = rules.get(t);
			BoolValue vNew = ded.get(t);
			if(vOld != null && vNew != vOld) {
				System.out.println("Contradiction!");
				break;
			}

			System.out.println(t.getKey().literals + " " + ded.values());

			//toAdd.putAll();
		}

		rules.putAll(toAdd);
		for(Map.Entry<TableValue, BoolValue> t : rules.entrySet()) {
			//System.out.println(t.getKey().literals + " " + t.getValue());

		}
		System.out.println("\n\n\n\n\n\n");
	}

	private Map<TableValue, BoolValue> deduct(TableValue table, BoolValue value) {

		//Count how many times is true
		List<String> literals = new ArrayList<>();
		table.rows.forEach((s,b)-> {
			if(b.equals(value)) {

				if(literals.isEmpty()) {
					literals.add(s);
				} else {
					String prev = literals.get(literals.size() - 1);
					StringBuilder newStr = new StringBuilder();
					for (int i = 0; i < s.length(); i++) {
						if (prev.charAt(i) != s.charAt(i))
							newStr.append("-");
						else newStr.append(prev.charAt(i));
					}
					literals.add(newStr.toString());
				}
			}
		});


		Map<TableValue, BoolValue> maps = new HashMap<>();
		if(literals.isEmpty())
			return maps;

		int i = 0;
		String finalVals = literals.get(literals.size()-1);

		for(String l : table.literals) {
			BoolValue val =null;
			if(finalVals.charAt(i) != '-')
				val = new BoolValue(finalVals.charAt(i) == '1');
			maps.put(new TableValue(l), val);
			i++;
		}

		return maps;
	}

	public String getValue() {
		return toString();
	}

	@Override
	public String toString() {
		return rules.toString();
	}

	@Override
	public boolean equals(Object obj) {
		return false;
	}
	
	
	
	
}

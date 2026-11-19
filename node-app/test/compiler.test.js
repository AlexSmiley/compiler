import test from "node:test";
import assert from "node:assert/strict";
import {compile,run} from "../src/compiler.js";
import {lex} from "../src/lexer.js";
import {parseEnvironment} from "../src/environment.js";
const source="процедура ()\nпочеток\nоди\nсвртиДесно\nоди\nостави\nкрај";
const environment="околина (5,5)\nѕидови\nпочеток\nкрај\nжетони\nпочеток\nкрај\nробот И (1,1)";
test("lexer recognizes Macedonian keywords and source positions",()=>{const r=lex("почеток\nоди");assert.equal(r.diagnostics.length,0);assert.equal(r.tokens[0].type,"keyword");assert.equal(r.tokens[1].line,2);});
test("compiler builds a program and RIMAL output",()=>{const r=compile(source);assert.equal(r.success,true);assert.match(r.rimal,/main:/);assert.match(r.rimal,/go/);});
test("syntax errors are returned as structured diagnostics",()=>{const r=compile("процедура () почеток оди крај");assert.equal(r.success,false);assert.equal(r.diagnostics[0].severity,"error");});
test("environment parser validates dimensions and robot location",()=>{const r=parseEnvironment(environment);assert.equal(r.diagnostics.length,0);assert.equal(r.environment.width,5);});
test("simulator executes commands and changes robot state",()=>{const r=run(source,environment);assert.equal(r.success,true);assert.deepEqual(r.run.world.robot,{direction:"Ј",x:2,y:2});assert.deepEqual(r.run.world.tokens,[[2,2]]);});
test("repeated commands are executed the requested number of times",()=>{const s="процедура () почеток повторувај 3 пати: ! оди ! крај";const e="околина (5,5) ѕидови почеток крај жетони почеток крај робот И (1,1)";const r=run(s,e);assert.equal(r.success,true);assert.equal(r.run.world.robot.x,4);});

test("the bundled legacy RoboL example parses through the Node.js compiler",()=>{const legacy="процедура нешто (број т, број џ)\nт = 4\nџ = 5\nпочеток\nостави\nкрај\n\nпроцедура ()\nпочеток\nповторувај 5 пати:\n!\nостави\nоди\n!\nако(џ==4)\n!\nсвртиДесно\n!\nповторувај до (џ==4)\n!\nџ=4\n!\nнешто (2,3)\nтелепорт(3,4)\nкрај";const r=compile(legacy);assert.equal(r.success,true,JSON.stringify(r.diagnostics));});

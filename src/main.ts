import { Cliente } from "./Cliente";
import { Conta } from "./Conta";
import { NotifSMS, NotifEmail, NotifAplicativo } from "./canais";
import {
  ValorInvalidoException,
  SaldoInsuficienteException,
  ContaBloqueadaException,
  LimiteDiarioExcedidoException,
} from "./exceptions";


const joao = new Cliente("João Silva", "111.111.111-11", "Rua A, 10", 2500);
const ana  = new Cliente("Ana Souza",  "222.222.222-22", "Rua B, 20", 4800);


const c1 = new Conta("1001", "001", new Date(), 100, 500, new NotifSMS());
const c2 = new Conta("1002", "001", new Date(), 2000, 500, new NotifEmail());
const c3 = new Conta("1003", "001", new Date(), 50, 500, new NotifAplicativo());

joao.adicionarConta(c1);
ana.adicionarConta(c2);
ana.adicionarConta(c3);


console.log("\n=== Situação 1: saque OK ===");
try {
  c2.sacar(100, ana);
} catch (e) {
  console.log("Erro:", (e as Error).message);
}


console.log("\n=== Situação 2: saldo insuficiente ===");
try {
  c1.sacar(150, joao);
} catch (e) {
  if (e instanceof SaldoInsuficienteException) {
    console.log(`Erro: ${e.message} | falta: ${e.quantoFalta}`);
  } else {
    console.log("Erro:", (e as Error).message);
  }
}


console.log("\n=== Situação 3: valor inválido ===");
try {
  c3.sacar(-50, ana);
} catch (e) {
  if (e instanceof ValorInvalidoException) {
    console.log("Erro:", e.message);
  }
}


console.log("\n=== Situação 4: conta bloqueada ===");
c3.setBloqueada(true);
try {
  c3.sacar(10, ana);
} catch (e) {
  if (e instanceof ContaBloqueadaException) {
    console.log("Erro:", e.message);
  }
}


console.log("\n=== Situação 5: limite diário excedido ===");
try {
  c1.depositar(1000);   
  c1.sacar(400, joao);  
  c1.sacar(200, joao);  
} catch (e) {
  if (e instanceof LimiteDiarioExcedidoException) {
    console.log("Erro:", e.message);
  }
}


console.log("\n=== Situação 6: depósito inválido ===");
try {
  c2.depositar(0);
} catch (e) {
  if (e instanceof ValorInvalidoException) {
    console.log("Erro:", e.message);
  }
}
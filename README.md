# Joms-supply-chain

El siguiente proyecto tiene como objetivo mostrar la implementación de un prototipo para la trazabilidad de frutas.
El presente proyecto hace parte del curso EAFIT - Arquitectura de Software Octubre - Noviembre del 2019.

## Equipo
El equipo está conformado por:

- José Andrés Villarreal Tovar
- Miguel Bolivar
- Sebastián López
- Oscar Soto

Todos los integrantes han trabajado arduamente en la documentación y desarrollo del proyecto.

## Objetivo
El objetivo primario es demostrar por medio de un prototipo funcional la trazabilidad de la fruta para una empresa exportadora.
Dicha empresa tiene demasiados contextos delimitados (`Bounded Context`) en el espacio del problema; sin embargo, se ha optado por centrarnos en el desarrollo
de la trazabilidad de la fruta, desde que es despachada desde unas fincas hasta que llegue al destino final. En cualquier momento
cualquiera de los participantes puede obtener información sobre una fruta particular.

Cabe mencionar que el concepto utilizado de fruta debe ser entendido como cualquier objeto, ya sea físico o abstracto, que la 
finca desea exponer. De esta manera el concepto fruta puede ser entendido y usado como paleta, caja u otro elemento. Para mayor 
información, consultar el documento de arquitectura del sistema.

## Introducción

A continuación se explican algunos conceptos básicos los cuales son los responsables para tener toda la red de Blockchain
ejecutándose.

**Validators**: los validadores son nodes los cuales están interconectados en forma de mmala y que pueden hablar con otros nodos.
Estos nodos mantienen los datos en forma de **merkle tree** el cual también es conocido como datos de libro mayor. Esta aplicación
escribe y retira datos de este **merkle tree**.

**Transaction Processors**: También conocidos como **tp**. Cada proyecto tendra un conjunto de reglas de negocios para ser validadas
durante el funcionamiento del sistema. Estas reglas también son llamadas **smart contracts** en general en el mundo del blockchain.
En el actual proyecto los llamamos **transaction processors** y se encargan de cada transacción antes de hacer asentar cada nodo.

**Sawtooth Rest Server**: El Servidor REST es el servicio el cual ayuda a los usuarios  a hablar con los **validatores** para enviar
cada transacción con la ayuda de Request HTTP. 


## Instalar

### Pre-requisitos
Asegurese que tiene instalado todos los siguientes pre-requisitos en su máquina de desarrollo:

* Git - [Descargar & Instalar Git](https://git-scm.com/downloads).
* Node.js `v10.17.0`- [Descargar & Instalar Node.js](https://nodejs.org/en/download/) y el manejador de paquestes npm.
* Docker `v18.09.7` - [Descargar & Instalar Docker](https://www.docker.com/)
* Docker-compose `v1.24.0` - - [Descargar & Instalar Docker](https://docs.docker.com/compose/install/)


### Instalación


#### Cloning The GitHub Repository
La forma recomendada es usar una consola para clonar directamente del repositorio.

```bash
$ git clone https://github.com/villarrealtovar/joms-supply-chain.git joms
```

Este comando clonará la última version del repositorio JOMS-SUPPLY-CHAIN en el folder **joms** 


#### Ejecutando la aplicación
Se puede ingresar al folder **joms** con el siguiente comando


```bash
$ cd joms
```

una vez dentro del folder **joms** se ejecuta el siguiente comando, el cual descargara diferentes imagenes e inicializará
los contenedores

```bash
$joms  docker-compose up
```

Una vez que finalice el comando, abrir otra terminal, e ir al folder **joms/tp**. Una vez ahí, se ejecuta el siguiente comando

```bash
$joms/tp  node index.js
```
El anterior comando levantará los servicios del **transaction-processor**


## Uso

Una vez que se encuentre los anteriores servicios corriendo, se ingresa al folder **client** el cual es un cliente por
consola y es el encargado de interactuar con el blockchain. Para ello, se abre una nueva terminal y se cambia de directorio

```bash
$joms cd client
```
Una vez ahí, se pueden ejecutar los siguientes comandos para ver la funcionalidad del Blockchain en trazabilidad. 

### 1. Crear usuario (owner)
El paso inicial es crear diferentes usuarios o roles tales como Despacho, Cliente, Finca, entre otros.

```bash
$joms/client node sendRequest.js  '{"action": "createOwner", "owner": "Finca"}'

$joms/client node sendRequest.js  '{"action": "createOwner", "owner": "Despacho"}'
```

### 2. Consultar usuarios
Una vez que un usuario se encuentra creado, se pueden consultar por medio del siguiente comando:

```bash
$joms/client node sendRequest.js  '{"action": "getOwner", "owner": "Despacho"}'
```

### 3. Crear Fruta
Se puede asociar frutas a un usuario con el siguiente comando:

```bash
$joms/client node sendRequest.js  '{"action": "createFruit", "owner": "Finca", "fruit": "Durazno"}'
```

### 4. Transferir Fruta
Un usuario puede transferir la fruta a otro usuario por medio del siguiente comando:

```bash
$joms/client node sendRequest.js  node sendRequest.js  '{"action": "transferFruit", "oldOwner": "Finca", "fruit": "Durazno", "owner":"Despacho"}'
```

Cabe resaltar que esta transferencia no se realiza de manera automática. El usuario que esta recibiendo la fruta debe de aceptar
o rechazar la fruta.


### 5 Transferencia Aceptada/Rechazada
El usuario que recibe la transferencia puede aceptar o rechazar este procedimiento. 

#### 5.1 Aceptar la fruta.
Una vez que el usuario acepta la transferencia, queda como dueño de la fruta.

```bash
$joms/client node sendRequest.js  '{"action": "acceptTransfer", "owner": "Despacho", "fruit": "Durazno"}'
```

#### 5.2 reject fruit
El usurio quien recibe la fruta puede rechazar la transacción y queda el dueño inicial.

```bash
$joms/client node sendRequest.js  '{"action": "rejectTransfer", "owner": "Despacho", "fruit": "Durazno"}'
```






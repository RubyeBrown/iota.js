import { Bip32Path, Blake2b, Ed25519 } from "@iota/crypto.js";
import {
    ADDRESS_UNLOCK_CONDITION_TYPE,
    BASIC_OUTPUT_TYPE, Bech32Helper,
    DEFAULT_PROTOCOL_VERSION,
    Ed25519Address,
    Ed25519Seed,
    ED25519_ADDRESS_TYPE,
    ED25519_SIGNATURE_TYPE,
    IBasicOutput, IBlock, IndexerPluginClient, IOutputsResponse, ITransactionEssence, ITransactionPayload, IUTXOInput,
    OutputTypes,
    serializeOutput, serializeTransactionEssence, SIGNATURE_UNLOCK_TYPE, SingleNodeClient,
    TRANSACTION_ESSENCE_TYPE,
    TRANSACTION_PAYLOAD_TYPE,
    UnlockTypes,
    UTXO_INPUT_TYPE,
    
} from "@iota/iota.js";
import { Converter, WriteStream } from "@iota/util.js";
import { NeonPowProvider } from "@iota/pow-neon.js";
import bigInt from "big-integer";
import fetch from "node-fetch";
import { randomBytes } from "node:crypto";


const API_ENDPOINT = "http://localhost:14265/";
// const FAUCET = "https://faucet.alphanet.iotaledger.net/api/enqueue" 
const FAUCET = "http://localhost:8091/api/enqueue"; // if runnig private tangle

async function run() {
    // Neon localPoW is blazingly fast, but you need rust toolchain to build
    const client = new SingleNodeClient(API_ENDPOINT, {powProvider: new NeonPowProvider()});
    const indexerPluginClient = new IndexerPluginClient(client);

    //Fetch node info
    const nodeInfo = await client.info();
    const protocolInfo = await client.protocolInfo();
    /********************
    **Create hot wallet used in example
    *********************/

    // These are the default values from the Hornet alphanet configuration
    // const mnemonic =
    //     "giant dynamic museum toddler six deny defense ostrich bomb access mercy blood explain muscle shoot shallow glad autumn author calm heavy hawk abuse rally";

    // Generate the seed from the Mnemonic
    // const genesisSeed = Ed25519Seed.fromMnemonic(mnemonic);
    const genesisSeed =  new Ed25519Seed(randomBytes(32));

    const genesisPath = new Bip32Path("m/44'/4218'/0'/0'/0'");

    const genesisWalletSeed = genesisSeed.generateSeedFromPath(genesisPath);
    const genesisWalletKeyPair = genesisWalletSeed.keyPair();

    // Get the address for the path seed which is actually the Blake2b.sum256 of the public key
    // display it in both Ed25519 and Bech 32 format
    const genesisEd25519Address = new Ed25519Address(genesisWalletKeyPair.publicKey);
    const genesisWalletAddress = genesisEd25519Address.toAddress();
    const genesisWalletAddressHex = Converter.bytesToHex(genesisWalletAddress, true);
    const genesisWalletAddressBech32 = Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, genesisWalletAddress, nodeInfo.protocol.bech32HRP);

    console.log("Genesis");
    console.log("\tSeed", Converter.bytesToHex(genesisWalletSeed.toBytes()));
    console.log("\tAddress Ed25519", genesisWalletAddressHex);
    console.log("\tAddress Bech32", genesisWalletAddressBech32);


    // Put here you mnemonic
    // const mnemonic =
    //     "assist file add kidney sense anxiety march quality sphere stamp crime swift mystery bind thrive impact walk solar asset pottery nation dutch column beef";
    // Generate the seed from the Mnemonic
    //const walletSeed = Ed25519Seed.fromMnemonic(mnemonic);
    // Create a new seed for the wallet
    const walletSeed = new Ed25519Seed(randomBytes(32));

    // Use the new seed like a wallet with Bip32 Paths 44,4128,accountIndex,isInternal,addressIndex
    const walletPath = new Bip32Path("m/44'/4218'/0'/0'/0'");
    const walletAddressSeed = walletSeed.generateSeedFromPath(walletPath);
    const walletKeyPair = walletAddressSeed.keyPair();
    const walletEd25519Address = new Ed25519Address(walletKeyPair.publicKey);

    const newAddress = walletEd25519Address.toAddress();
    const newAddressHex = Converter.bytesToHex(newAddress, true);
    const newAddressBech32 = Bech32Helper.toBech32(ED25519_ADDRESS_TYPE, newAddress, nodeInfo.protocol.bech32HRP);
    
    console.log("Wallet 1");
    console.log("\tSeed:", Converter.bytesToHex(walletSeed.toBytes()));
    console.log("\tPath:", walletPath.toString());
    console.log(`\tAddress Ed25519 ${walletPath.toString()}:`, newAddressHex);
    console.log(`\tAddress Bech32 ${walletPath.toString()}:`, newAddressBech32);
    console.log();
    
    //Request funds from faucet
    const genesisFunds = await requestFunds(FAUCET, genesisWalletAddressBech32);
    console.log("genesisFunds: ", genesisFunds)

    //Amount to send in transaction
    const amountToSend = bigInt(10000000);
    console.log("amountToSend: ", amountToSend)
    
    /*******************************
    ** Prepare Transaction
    *******************************/
 
    // 1. Fetch outputId with funds to be used as input
    // Indexer returns outputIds of matching outputs. We are only interested in the first one coming from the faucet.
    const outputId = await fetchAndWaitForBasicOutput(genesisWalletAddressBech32, indexerPluginClient);
    console.log("OutputId: ", outputId);

    // Fetch the output itself
    const outputResponse = await client.output(outputId);
    const consumedOutput = outputResponse.output;
    console.log("To be consumed output: ", JSON.stringify(consumedOutput));

    if (parseInt(amountToSend.toString()) > parseInt(consumedOutput.amount)) {
        throw new Error("Not enough funds to send. Request funds from faucet:" + FAUCET);
    }
    // 2. Prepare Inputs for the transaction
    const input: IUTXOInput = {
        type: UTXO_INPUT_TYPE,
        transactionId: outputResponse.metadata.transactionId,
        transactionOutputIndex: outputResponse.metadata.outputIndex
    }
    console.log("Input: ", input, '\n');

    // 3. Create outputs, in this simple example only one basic output and a remainder that goes back to genesis address
    const outputsWithSerialization: {
        output: IBasicOutput;
        serializedHex: string;
    }[] = [];

    const basicOutput: IBasicOutput = {
        type: BASIC_OUTPUT_TYPE,
        amount: amountToSend.toString(),
        nativeTokens: [],
        unlockConditions: [
            {
                type: ADDRESS_UNLOCK_CONDITION_TYPE,
                address: {
                    type: ED25519_ADDRESS_TYPE,
                    pubKeyHash: newAddressHex
                }
            }
        ],
        features: []
    };
    const wsBasicOutput = new WriteStream();
    serializeOutput(wsBasicOutput, basicOutput);
    const fbBasicOutput = wsBasicOutput.finalBytes();
    const serializedBasicOutput = Converter.bytesToHex(fbBasicOutput);

    outputsWithSerialization.push({
        output: basicOutput,
        serializedHex: serializedBasicOutput
    })

    const remainderBasicOutput: IBasicOutput = {
        type: BASIC_OUTPUT_TYPE,
        amount: bigInt(consumedOutput.amount).minus(amountToSend).toString(),
        nativeTokens: [],
        unlockConditions: [
            {
                type: ADDRESS_UNLOCK_CONDITION_TYPE,
                address: {
                    type: ED25519_ADDRESS_TYPE,
                    pubKeyHash: genesisWalletAddressHex
                }
            }
        ],
        features: []
    };
    const wsRemainder = new WriteStream();
    serializeOutput(wsRemainder, remainderBasicOutput);
    const fbRemainder = wsRemainder.finalBytes();
    const serializedRemainderOutput = Converter.bytesToHex(fbRemainder);

    outputsWithSerialization.push({
        output: remainderBasicOutput,
        serializedHex: serializedRemainderOutput
    })

    // Lexicographically sort outputs
    const sortedOutputs = outputsWithSerialization.sort((a, b) => a.serializedHex.localeCompare(b.serializedHex))
    console.log("Sorted Outputs: ", sortedOutputs, '\n')

    // 4. Get inputs commitment
    const inputsCommitment = getInputsCommitment([consumedOutput]);
    console.log("Inputs Commitment: ", inputsCommitment, '\n');

    // 5.Create transaction essence
    const transactionEssence: ITransactionEssence = {
        type: TRANSACTION_ESSENCE_TYPE,
        networkId: protocolInfo.networkId,
        inputs: [input], // No need to Lexicographically sort inputs because we only have one input
        inputsCommitment,
        outputs: sortedOutputs.map(o => o.output),
        payload: undefined
    };

    const wsTsxEssence = new WriteStream();
    serializeTransactionEssence(wsTsxEssence, transactionEssence);
    const essenceFinal = wsTsxEssence.finalBytes();
    const essenceHash = Blake2b.sum256(essenceFinal);
    console.log("Transaction Essence: ", transactionEssence, '\n');

    // 6. Create the unlocks
    const unlockCondition: UnlockTypes = {
        type: SIGNATURE_UNLOCK_TYPE,
        signature: {
            type: ED25519_SIGNATURE_TYPE,
            // publicKey: genesisWalletAddressHex,
            publicKey: Converter.bytesToHex(genesisWalletKeyPair.publicKey, true),
            signature: Converter.bytesToHex(Ed25519.sign(genesisWalletKeyPair.privateKey, essenceHash), true)
        }
    };
    console.log("Unlock condition: ", unlockCondition, '\n');

    // 7. Create transaction payload
    const transactionPayload: ITransactionPayload = {
        type: TRANSACTION_PAYLOAD_TYPE,
        essence: transactionEssence,
        unlocks:[unlockCondition]
    };
    console.log("Transaction payload: ", transactionPayload, '\n');

    // 8. Create Block
    const block: IBlock = {
        protocolVersion: DEFAULT_PROTOCOL_VERSION,
        parents: [],
        payload: transactionPayload,
        nonce: "0"
    };
    console.log("Block: ", block, '\n');
    
    // 9. Submit block with pow
    console.log("Calculating PoW, submitting block...")
    const blockId = await client.blockSubmit(block);
    console.log("Submitted blockId is: ", blockId);
}

run()
    .then(() => console.log("Done"))
    .catch(err => console.error(err));

async function requestFunds(url: string, addressBech32: string): Promise<object> {
    const requestFounds = await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ address: addressBech32 })
        });

    return await requestFounds.json();
}
    
async function fetchAndWaitForBasicOutput(addy: string, client: IndexerPluginClient): Promise<string> {
    let outputsResponse: IOutputsResponse = { ledgerIndex: 0, cursor: "", pageSize: "", items: [] };
    let maxTries = 10;
    let tries = 0;
    while(outputsResponse.items.length == 0 ){
        if (tries > maxTries){break}
        tries++;
        console.log("\tTry #",tries,": fetching basic output for address ", addy)
        outputsResponse = await client.outputs({
            addressBech32: addy,
            hasStorageReturnCondition: false,
            hasExpirationCondition: false,
            hasTimelockCondition: false,
            hasNativeTokens: false,
        });
        if(outputsResponse.items.length == 0){
            console.log("\tDidn't find any, retrying soon...")
            await new Promise(f => setTimeout(f, 1000));}
    }
    if(tries > maxTries){
        throw new Error("Didn't find any outputs for address");
    }
    
    return outputsResponse.items[0]
};

function getInputsCommitment(inputs: [OutputTypes]): string {
    // Step 1: InputsCommitment calculation
    const inputsCommitmentHasher = new Blake2b(Blake2b.SIZE_256); // blake2b hasher
    // Step 2: Loop over list of inputs (the actual output objects they reference).
    inputs.forEach( value => {
        // Sub-step 2a: Calculate hash of serialized output
        const outputHasher = new Blake2b(Blake2b.SIZE_256);
        const w = new WriteStream();
        serializeOutput(w, value);
        const consumedOutputBytes = w.finalBytes();
        outputHasher.update(consumedOutputBytes);
        const outputHash = outputHasher.final();
        // Sub-step 2b: add each output hash to buffer
        inputsCommitmentHasher.update(outputHash);
    })
    return Converter.bytesToHex(inputsCommitmentHasher.final(), true);
};
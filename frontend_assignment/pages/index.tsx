import detectEthereumProvider from '@metamask/detect-provider'
import { Strategy, ZkIdentity } from '@zk-kit/identity'
import { generateMerkleProof, Semaphore } from '@zk-kit/protocols'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { providers, Contract } from 'ethers'
import Head from 'next/head'
import React, { useEffect } from 'react'
import styles from '../styles/Home.module.css'
import Greeter from 'artifacts/contracts/Greeters.sol/Greeters.json'
import { Item } from './components/Paper'
import { ethers } from 'ethers'
import { List, ListItem, ListItemText, Typography } from '@mui/material'

function generate(list: string[]) {
  console.log(list)
  return list.map((value: any, i: any) => (
    <ListItem key={i}>
      <ListItemText primary={value} key={i} />
    </ListItem>
  ))
}

export default function Home() {
  const [logs, setLogs] = React.useState('Connect your wallet and greet!')
  const [message, setMessage] = React.useState('')
  const [greetingList, setGreetingList] = React.useState<string[]>([])

  useEffect(() => {
    eventListener()
  }, [])

  async function eventListener() {
    const contract = new Contract(
      '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512',
      Greeter.abi,
    )

    const provider = new providers.JsonRpcProvider('http://localhost:8545')

    const contractOwner = contract.connect(provider.getSigner())

    contractOwner.on('NewGreeting', (greeting) => {
      const parsedGreet = ethers.utils.parseBytes32String(greeting)
      setGreetingList((oldGreetings) => [...oldGreetings, parsedGreet])
    })
  }

  async function greet(greeting: string) {
    setLogs('Creating your Semaphore identity...')

    const provider = (await detectEthereumProvider()) as any

    await provider.request({ method: 'eth_requestAccounts' })

    const ethersProvider = new providers.Web3Provider(provider)
    const signer = ethersProvider.getSigner()
    const message = await signer.signMessage(
      'Sign this message to create your identity!',
    )

    const identity = new ZkIdentity(Strategy.MESSAGE, message)
    const identityCommitment = identity.genIdentityCommitment()
    const identityCommitments = await (
      await fetch('./identityCommitments.json')
    ).json()

    const merkleProof = generateMerkleProof(
      20,
      BigInt(0),
      identityCommitments,
      identityCommitment,
    )

    setLogs('Creating your Semaphore proof...')

    const witness = Semaphore.genWitness(
      identity.getTrapdoor(),
      identity.getNullifier(),
      merkleProof,
      merkleProof.root,
      greeting,
    )

    const { proof, publicSignals } = await Semaphore.genProof(
      witness,
      './semaphore.wasm',
      './semaphore_final.zkey',
    )
    const solidityProof = Semaphore.packToSolidityProof(proof)

    const response = await fetch('/api/greet', {
      method: 'POST',
      body: JSON.stringify({
        greeting,
        nullifierHash: publicSignals.nullifierHash,
        solidityProof: solidityProof,
      }),
    })

    if (response.status === 500) {
      const errorMessage = await response.text()

      setLogs(errorMessage)
    } else {
      setLogs('Your anonymous greeting is onchain :)')
    }
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Greetings</title>
        <meta
          name="description"
          content="A simple Next.js/Hardhat privacy application with Semaphore."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Greetings</h1>

        <p className={styles.description}>
          A simple Next.js/Hardhat privacy application with Semaphore.
        </p>

        <div className={styles.logs}>{logs}</div>
        <Item>
          {' '}
          <TextField
            margin="normal"
            fullWidth
            label="Greeting Message"
            defaultValue="Hey buddy!"
            onChange={(e) => {
              setMessage(e.target.value)
            }}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            onClick={() => {
              greet(message)
            }}
          >
            Send Greeting
          </Button>
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            All Greetings
          </Typography>
          <List dense={true}>{generate(greetingList)}</List>
        </Item>
      </main>
    </div>
  )
}

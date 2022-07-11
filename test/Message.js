const { ethers, upgrades } = require('hardhat')
const { expect } = require('chai')
const compiledMessage = require('../artifacts/contracts/Message.sol/Message.json')
const compiledMessageV2 = require('../artifacts/contracts/Message.sol/MessageV2.json')
const compiledMessageV3 = require('../artifacts/contracts/Message.sol/MessageV3.json')

let Message, message, MessageV2, messageV2, MessageV3, messageV3
beforeEach(async () => {
  const [owner] = await ethers.getSigners()
  Message = await ethers.getContractFactory(
    compiledMessage.abi,
    compiledMessage.bytecode,
  )
  MessageV2 = await ethers.getContractFactory(
    compiledMessageV2.abi,
    compiledMessageV2.bytecode,
  )
  MessageV3 = await ethers.getContractFactory(
    compiledMessageV3.abi,
    compiledMessageV3.bytecode,
  )
  message = await upgrades.deployProxy(Message, { kind: 'uups' })
  await message.deployed()

  messageV2 = await upgrades.upgradeProxy(message, MessageV2)
  await messageV2.deployed()

  messageV3 = await upgrades.upgradeProxy(messageV2, MessageV3)
  await messageV3.deployed()
})

describe('Message Contract', () => {
  it('get initial message', async () => {
    const msg = await message.message()

    expect(msg).to.equal('First message')
  })

  it('updates message', async () => {
    await message.updateMessage('Second message')
    const msg = await message.message()

    expect(msg).to.equal('Second message')
  })

  it('upgrades contract', async () => {
    expect(messageV2.address).to.equal(message.address)
  })

  it('deletes message', async () => {
    await messageV2.deleteMessage()

    const msg = await message.message()
    expect(msg).to.equal('')
  })

  it('upgrades to V3', async () => {
    expect(messageV3.address).to.equal(message.address)
    expect(messageV3.address).to.equal(messageV2.address)
  })

  it('V3 functions works', async () => {
    await messageV3.addName('Tanimola')
    const myName = await messageV3.name()

    expect(myName).to.equal('Tanimola')
  })
})

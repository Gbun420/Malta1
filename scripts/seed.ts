
import { faker } from '@faker-js/faker';

// This script is a placeholder and will need to be adapted to the specific database and ORM used.

const createDemoData = async (options: { verified: boolean; disputed: boolean }) => {
  // Create a demo user
  const user = {
    email: faker.internet.email(),
    password_hash: faker.internet.password(),
  };

  // Create a verification record
  const verification = {
    user_id: 1, // assuming user id is 1
    status: options.verified ? 'verified' : 'not_verified',
  };

  // Create a listing
  const listing = {
    seller_id: 1,
    title: faker.commerce.productName(),
    description: faker.lorem.paragraph(),
    price: parseInt(faker.commerce.price()),
    category: 'electronics',
    condition: 'used',
    brand: faker.company.name(),
    model: faker.commerce.product(),
    serial_number: faker.string.uuid(),
    location: faker.location.city(),
    status: 'active',
  };

  // Create a message
  const message = {
    listing_id: 1, // assuming listing id is 1
    sender_id: 2, // assuming another user with id 2
    receiver_id: 1,
    content: faker.lorem.sentence(),
  };

  // Create a transaction
  const transaction = {
    listing_id: 1,
    buyer_id: 2,
    seller_id: 1,
    amount: listing.price,
    status: options.disputed ? 'disputed' : 'completed',
  };

  console.log('Demo data created:', { user, verification, listing, message, transaction });
};

// Example usage:
createDemoData({ verified: true, disputed: false });
createDemoData({ verified: false, disputed: true });

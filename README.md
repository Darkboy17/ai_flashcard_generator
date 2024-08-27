# Flashcard SaaS Application

Welcome to the Flashcard SaaS Application! This application is designed to generate clear, concise, and effective flashcards on various topics, facilitating efficient learning and memorization. Each flashcard consists of a question on one side and the corresponding answer on the other, tailored to facilitate efficient learning across a wide range of subjects, from academic disciplines to practical skills. Our AI-powered flashcard generator focuses on creating high-quality study aids that are brief, to the point, and tailored to the intended audience's difficulty level. Whether you're studying for exams, preparing for certifications, or simply looking to expand your knowledge, our service is here to assist you in creating the perfect study tool.

## Features

-   **AI-Powered Generation:**  Leveraging advanced AI models, we generate flashcards that are optimized for learning efficiency.
-   **Wide Range of Subjects:**  Generate flashcards on any subject matter, from academic disciplines to practical skills.
-   **Simple Language:**  Ensures clarity and understanding with straightforward language.
-   **Effective Learning Aid:**  Designed to facilitate efficient memorization and learning.
-   **Consistent Format:**  Maintains a consistent format for similar types of information for easy review.
-   **Secure and Safe:**  Built with safety settings to block harmful content, ensuring a positive learning experience.
-   **User Authentication:**  Powered by Clerk, providing secure and seamless user authentication.
-   **Subscription Plans:**  Offers various subscription plans through Stripe for personalized learning experiences.

## User Authentication with Clerk

Clerk provides seamless user authentication, allowing users to sign up, log in, and manage their accounts securely. With Clerk, we ensure a smooth user experience from the moment they join our platform until they generate their first flashcard.

## Subscription Plans

We offer several subscription plans tailored to fit different learning needs and budgets. Powered by Stripe, we handle payments securely and efficiently, allowing users to choose the plan that best suits them.

### Free Plan

-   Access to a limited number of flashcard generations per month.
-   Basic customization options.

### Premium Plan

-   Unlimited flashcard generation.
-   Advanced customization options, including difficulty level adjustments and personalized flashcard formats.
-   Priority support.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live server.

### Prerequisites

Before you begin, ensure you have met the following requirements:

-   Node.js installed
-   A Google Cloud project setup for Vertex AI access
-   Basic knowledge of Next.js for frontend modifications
-   Clerk and Stripe accounts configured for user authentication and payments

## Installation

Clone the repository:

`git clone https://github.com/yourusername/flashcard-saas.git cd flashcard-saas npm  install  npm run dev`


### Usage

`npm start`

## User Authentication with Clerk

Clerk handles all aspects of user authentication, providing a secure and seamless experience. Users can sign up, log in, and manage their profiles effortlessly.

### Setting up Clerk

1.  Sign up for a Clerk account and obtain your Clerk Secret Key.
2.  Configure Clerk in your  `.env.local`  file:

`CLERK_SECRET_KEY="your_clerk_secret_key_here"`

Ensure Clerk is properly integrated into your Next.js application for authentication flows.

## Subscription Management with Stripe

Stripe handles subscription payments, offering flexibility in choosing plans that suit users' needs.

### Setting up Stripe

1.  Sign up for a Stripe account and obtain your API keys.
2.  Configure Stripe in your environment variables:

`STRIPE_PUBLIC_KEY="your_stripe_public_key_here"  STRIPE_SECRET_KEY="your_stripe_secret_key_here"`

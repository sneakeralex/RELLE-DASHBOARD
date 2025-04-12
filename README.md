# README.md

# Beauty Chain Dashboard

Welcome to the Beauty Chain Dashboard project! This application is designed to provide a comprehensive dashboard for beauty chain businesses, showcasing essential data such as user and order statistics.

## Project Structure

The project is organized as follows:

```
beauty-chain-dashboard
├── src
│   ├── components
│   │   ├── Dashboard.ts        # Main dashboard view displaying statistics
│   │   ├── OrderStats.ts       # Component for displaying order statistics
│   │   ├── UserStats.ts        # Component for displaying user statistics
│   │   └── Charts
│   │       ├── LineChart.ts    # Line chart for visualizing trends
│   │       └── BarChart.ts     # Bar chart for comparing statistics
│   ├── services
│   │   ├── api.ts              # API call functions
│   │   ├── orderService.ts     # Functions for order data handling
│   │   └── userService.ts      # Functions for user data handling
│   ├── types
│   │   ├── order.ts            # Order data structure definition
│   │   └── user.ts             # User data structure definition
│   ├── utils
│   │   └── dateUtils.ts        # Utility functions for date manipulation
│   └── app.ts                  # Entry point of the application
├── package.json                 # npm configuration file
├── tsconfig.json               # TypeScript configuration file
└── README.md                   # Project documentation
```

## Features

- Display total users and orders
- Show recent week and month statistics for users and orders
- Visualize trends using line and bar charts

## Getting Started

To get started with the project, clone the repository and install the dependencies:

```bash
git clone <repository-url>
cd beauty-chain-dashboard
npm install
```

## Running the Application

To run the application, use the following command:

```bash
npm start
```

## License

This project is licensed under the MIT License.